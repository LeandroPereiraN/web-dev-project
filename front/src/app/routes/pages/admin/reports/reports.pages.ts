import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import type {
  ContentReportItem,
  ContentReportReason,
  ModerationActionType,
} from '../../../../shared/types/admin';
import { AdminService } from '../../../../shared/services/admin.service';

type StatusFilter = 'all' | 'unresolved' | 'resolved';
type ActionType = 'approve' | 'delete';

@Component({
  selector: 'app-reports',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    PaginatorModule,
    SkeletonModule,
    DialogModule,
  ],
  templateUrl: './reports.pages.html',
})
export class ReportsPages {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly reports = signal<ContentReportItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);
  readonly detailDialogVisible = signal(false);
  readonly actionDialogVisible = signal(false);
  readonly detailReport = signal<ContentReportItem | null>(null);
  readonly actionReport = signal<ContentReportItem | null>(null);
  readonly actionType = signal<ActionType>('approve');
  readonly actionSubmitting = signal(false);

  readonly statusOptions: Array<{ label: string; value: StatusFilter }> = [
    { label: 'Todos los reportes', value: 'all' },
    { label: 'Pendientes', value: 'unresolved' },
    { label: 'Resueltos', value: 'resolved' },
  ];

  readonly statusControl: FormControl<StatusFilter> = this.fb.nonNullable.control('all');

  readonly actionForm: FormGroup<{
    justification: FormControl<string>;
    internalNotes: FormControl<string | null>;
  }> = this.fb.group({
    justification: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    internalNotes: this.fb.control<string | null>(null, [Validators.maxLength(300)]),
  });

  constructor() {
    this.statusControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.page.set(1);
      this.fetchReports();
    });

    this.fetchReports();
  }

  async fetchReports(): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const resolvedFilter = this.resolveFilterValue(this.statusControl.value);

      const response = await this.adminService.getReports({
        resolved: resolvedFilter,
        page: this.page(),
        limit: this.pageSize(),
      });

      this.reports.set(response.items);
      this.total.set(response.total);
    } catch (error) {
      console.error('Error fetching reports', error);
      this.errorMessage.set('No pudimos cargar los reportes. Intenta nuevamente en unos minutos.');
      this.reports.set([]);
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
    this.fetchReports();
  }

  openDetails(report: ContentReportItem): void {
    this.detailReport.set(report);
    this.detailDialogVisible.set(true);
  }

  closeDetails(): void {
    this.onDetailDialogVisibilityChange(false);
  }

  openAction(report: ContentReportItem, type: ActionType): void {
    this.actionReport.set(report);
    this.actionType.set(type);
    this.actionForm.reset({ justification: '', internalNotes: null });
    this.actionDialogVisible.set(true);
  }

  closeActionDialog(): void {
    this.onActionDialogVisibilityChange(false);
  }

  async submitAction(): Promise<void> {
    if (this.actionForm.invalid || this.actionSubmitting()) {
      this.actionForm.markAllAsTouched();
      return;
    }

    const report = this.actionReport();
    if (!report) {
      return;
    }

    const actionMap: Record<ActionType, ModerationActionType> = {
      approve: 'APPROVE_SERVICE',
      delete: 'DELETE_SERVICE',
    };

    const { justification, internalNotes } = this.actionForm.getRawValue();

    this.actionSubmitting.set(true);

    try {
      await this.adminService.moderateService({
        serviceId: report.serviceId,
        actionType: actionMap[this.actionType()],
        justification: justification.trim(),
        internalNotes: internalNotes?.trim() || undefined,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Acción registrada',
        detail:
          this.actionType() === 'approve'
            ? 'El servicio fue aprobado y los reportes se marcaron como resueltos.'
            : 'El servicio fue desactivado y los reportes asociados quedaron resueltos.',
        life: 3500,
      });

      this.closeActionDialog();
      this.fetchReports();
    } catch (error) {
      console.error('Error executing moderation action', error);
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos completar la acción',
        detail: 'Intenta nuevamente más tarde.',
        life: 4000,
      });
      this.actionSubmitting.set(false);
    }
  }

  async toggleReportStatus(report: ContentReportItem): Promise<void> {
    try {
      const updated = await this.adminService.updateReportStatus({
        reportId: report.id,
        resolved: !report.isResolved,
      });

      this.reports.update((items) =>
        items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Reporte actualizado',
        detail: updated.isResolved
          ? 'El reporte se marcó como resuelto.'
          : 'El reporte volvió a estado pendiente.',
        life: 3000,
      });
    } catch (error) {
      console.error('Error updating report status', error);
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos actualizar el reporte',
        detail: 'Revisa tu conexión e intenta nuevamente.',
        life: 4000,
      });
    }
  }

  resolveReasonLabel(reason: ContentReportReason): string {
    const labels: Record<ContentReportReason, string> = {
      ILLEGAL_CONTENT: 'Contenido ilegal',
      FALSE_INFORMATION: 'Información falsa',
      OFFENSIVE_CONTENT: 'Contenido ofensivo',
      SPAM: 'Spam',
      SCAM: 'Estafa',
      OTHER: 'Otro',
    };

    return labels[reason] ?? reason;
  }

  resolveStatusLabel(isResolved: boolean): string {
    return isResolved ? 'Resuelto' : 'Pendiente';
  }

  resolveStatusSeverity(isResolved: boolean): 'success' | 'warn' {
    return isResolved ? 'success' : 'warn';
  }

  resolveActionLabel(type: ActionType): string {
    return type === 'approve' ? 'Aprobar servicio' : 'Desactivar servicio';
  }

  private resolveFilterValue(filter: StatusFilter): boolean | undefined {
    if (filter === 'unresolved') return false;
    if (filter === 'resolved') return true;
    return undefined;
  }

  onDetailDialogVisibilityChange(visible: boolean): void {
    this.detailDialogVisible.set(visible);
    if (!visible) {
      this.detailReport.set(null);
    }
  }

  onActionDialogVisibilityChange(visible: boolean): void {
    this.actionDialogVisible.set(visible);
    if (!visible) {
      this.actionReport.set(null);
      this.actionSubmitting.set(false);
      this.actionForm.reset({ justification: '', internalNotes: null });
    }
  }
}
