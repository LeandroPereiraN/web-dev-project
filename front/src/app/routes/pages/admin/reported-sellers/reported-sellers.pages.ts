import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import type { ReportedSellerItem } from '../../../../shared/types/admin';
import { AdminService } from '../../../../shared/services/admin.service';

@Component({
  selector: 'app-reported-sellers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TableModule, PaginatorModule, SkeletonModule, TagModule],
  templateUrl: './reported-sellers.pages.html',
})
export class ReportedSellersPages {
  private readonly adminService = inject(AdminService);

  readonly sellers = signal<ReportedSellerItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);

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
}
