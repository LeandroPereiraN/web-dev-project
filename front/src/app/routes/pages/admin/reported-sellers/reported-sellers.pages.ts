import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import type { ReportedSellerItem } from '../../../../shared/types/admin';
import { AdminService } from '../../../../shared/services/admin.service';

@Component({
  selector: 'app-reported-sellers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    PaginatorModule,
    SkeletonModule,
    TagModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './reported-sellers.pages.html',
})
export class ReportedSellersPages {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  readonly sellers = signal<ReportedSellerItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);
  readonly sellerActionDialogVisible = signal(false);
  readonly sellerActionType = signal<'suspend' | 'activate' | 'delete'>('suspend');
  readonly sellerActionSubmitting = signal(false);
  readonly selectedSeller = signal<ReportedSellerItem | null>(null);

  readonly sellerActionForm: FormGroup<{
    justification: FormControl<string>;
    internalNotes: FormControl<string | null>;
  }> = this.fb.group({
    justification: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    internalNotes: this.fb.control<string | null>(null, [Validators.maxLength(300)]),
  });

  constructor() {
    this.loadSellers();
  }

  async loadSellers(): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const response = await this.adminService.getReportedSellers({
        page: this.page(),
        limit: this.pageSize(),
      });

      this.sellers.set(response.items);
      this.total.set(response.total);
    } catch (error) {
      console.error('Error fetching reported sellers', error);
      this.errorMessage.set('No pudimos obtener los vendedores reportados en este momento.');
      this.sellers.set([]);
      this.total.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(event: PaginatorState): void {
    const nextPage = (event.page ?? 0) + 1;
    const rows = event.rows ?? this.pageSize();
    this.page.set(nextPage);
    this.pageSize.set(rows);
    this.loadSellers();
  }

  resolveReasonLabel(reason: string): string {
    const labels: Record<string, string> = {
      ILLEGAL_CONTENT: 'Contenido ilegal',
      FALSE_INFORMATION: 'Información falsa',
      OFFENSIVE_CONTENT: 'Contenido ofensivo',
      SPAM: 'Spam',
      SCAM: 'Estafa',
      OTHER: 'Otro',
    };
    return labels[reason] ?? reason;
  }

  resolveReasonSeverity(reason: string): 'danger' | 'warn' | 'info' | 'secondary' {
    switch (reason) {
      case 'SCAM':
      case 'ILLEGAL_CONTENT':
        return 'danger';
      case 'SPAM':
      case 'OFFENSIVE_CONTENT':
        return 'warn';
      case 'FALSE_INFORMATION':
        return 'info';
      default:
        return 'secondary';
    }
  }

  openSellerAction(action: 'suspend' | 'activate' | 'delete', seller: ReportedSellerItem): void {
    this.sellerActionType.set(action);
    this.selectedSeller.set(seller);
    this.sellerActionForm.reset({ justification: '', internalNotes: null });
    this.sellerActionDialogVisible.set(true);
  }

  closeSellerActionDialog(): void {
    this.sellerActionDialogVisible.set(false);
    this.sellerActionSubmitting.set(false);
    this.selectedSeller.set(null);
    this.sellerActionForm.reset({ justification: '', internalNotes: null });
  }

  async submitSellerAction(): Promise<void> {
    if (this.sellerActionForm.invalid || this.sellerActionSubmitting()) {
      this.sellerActionForm.markAllAsTouched();
      return;
    }

    const seller = this.selectedSeller();
    if (!seller) return;

    const { justification, internalNotes } = this.sellerActionForm.getRawValue();
    const trimmedJustification = justification.trim();
    const trimmedNotes = internalNotes?.trim() || undefined;

    this.sellerActionSubmitting.set(true);
    try {
      const actionType = this.sellerActionType();
      if (actionType === 'delete') {
        await this.adminService.deleteSeller({
          sellerId: seller.sellerId,
          justification: trimmedJustification,
          internalNotes: trimmedNotes,
        });
      } else {
        await this.adminService.moderateSeller({
          sellerId: seller.sellerId,
          action: actionType,
          justification: trimmedJustification,
          internalNotes: trimmedNotes,
        });
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Acción aplicada',
        detail: `${this.resolveSellerActionLabel(
          this.sellerActionType()
        )} registrada correctamente.`,
        life: 3500,
      });

      this.closeSellerActionDialog();
      this.loadSellers();
    } catch (error) {
      console.error('Error executing seller action', error);
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos completar la acción',
        detail: 'Intentá nuevamente en unos minutos.',
        life: 4000,
      });
      this.sellerActionSubmitting.set(false);
    }
  }

  resolveSellerActionLabel(action: 'suspend' | 'activate' | 'delete'): string {
    switch (action) {
      case 'suspend':
        return 'Suspender vendedor';
      case 'activate':
        return 'Reactivar vendedor';
      case 'delete':
        return 'Eliminar cuenta';
      default:
        return 'Acción';
    }
  }
}
