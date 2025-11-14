import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import type { ModerationActionItem } from '../../../../shared/types/admin';
import { AdminService } from '../../../../shared/services/admin.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TimelineModule, CardModule, TagModule, PaginatorModule, SkeletonModule],
  templateUrl: './moderation.pages.html',
})
export class ModerationPages {
  private readonly adminService = inject(AdminService);

  readonly actions = signal<ModerationActionItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(8);
  readonly total = signal(0);

  constructor() {
    this.loadActions();
  }

  async loadActions(): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const response = await this.adminService.getModerationActions({
        page: this.page(),
        limit: this.pageSize(),
      });

      this.actions.set(response.items);
      this.total.set(response.total);
    } catch (error) {
      console.error('Error fetching moderation actions', error);
      this.errorMessage.set('No pudimos cargar el historial de moderación.');
      this.actions.set([]);
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
    this.loadActions();
  }

  resolveActionLabel(action: ModerationActionItem): string {
    switch (action.actionType) {
      case 'APPROVE_SERVICE':
        return 'Servicio aprobado';
      case 'DELETE_SERVICE':
        return 'Servicio desactivado';
      case 'SUSPEND_SELLER':
        return 'Vendedor suspendido';
      case 'DELETE_SELLER':
        return 'Cuenta eliminada';
      case 'REINSTATE_SELLER':
        return 'Vendedor rehabilitado';
      default:
        return 'Acción de moderación';
    }
  }

  resolveActionSeverity(action: ModerationActionItem): 'success' | 'danger' | 'warn' | 'info' {
    switch (action.actionType) {
      case 'APPROVE_SERVICE':
        return 'success';
      case 'DELETE_SERVICE':
      case 'DELETE_SELLER':
        return 'danger';
      case 'SUSPEND_SELLER':
        return 'warn';
      default:
        return 'info';
    }
  }

  resolveTarget(action: ModerationActionItem): string {
    if (action.serviceId) {
      return `Servicio #${action.serviceId}`;
    }
    if (action.sellerId) {
      return `Vendedor #${action.sellerId}`;
    }
    return 'Participante';
  }

  markerClasses(action: ModerationActionItem): string {
    const base =
      'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold';
    switch (this.resolveActionSeverity(action)) {
      case 'success':
        return `${base} border-emerald-400/40 bg-emerald-500/15 text-emerald-200`;
      case 'danger':
        return `${base} border-red-400/40 bg-red-500/15 text-red-200`;
      case 'warn':
        return `${base} border-amber-400/40 bg-amber-500/15 text-amber-200`;
      default:
        return `${base} border-sky-400/40 bg-sky-500/15 text-sky-200`;
    }
  }

  resolveAdminLabel(action: ModerationActionItem): string {
    return `Admin #${action.adminId}`;
  }
}
