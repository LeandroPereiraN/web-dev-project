import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { CatalogService } from '../../../shared/services/catalog.service';
import { UserService } from '../../../shared/services/user.service';
import { MainStore } from '../../../shared/stores/main.store';
import type { ServiceItem } from '../../../shared/types/service';
import type { ContactDetail, ContactStatusValue } from '../../../shared/types/user';
import { UyuCurrencyPipe } from '../../../shared/pipes/uyu-currency.pipe';

interface DashboardStats {
  activeServices: number;
  averagePrice: number;
  totalLeads: number;
  newLeads: number;
}

type ContactStatusFilter = 'ALL' | ContactStatusValue;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    PaginatorModule,
    SkeletonModule,
    SelectModule,
    UyuCurrencyPipe,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  private readonly catalogService = inject(CatalogService);
  private readonly userService = inject(UserService);
  private readonly mainStore = inject(MainStore);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sellerId = this.mainStore.user()?.id ?? null;

  readonly stats = signal<DashboardStats>({
    activeServices: 0,
    averagePrice: 0,
    totalLeads: 0,
    newLeads: 0,
  });

  readonly initialLoading = signal(true);
  readonly servicesLoading = signal(false);
  readonly contactsLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly services = signal<ServiceItem[]>([]);
  readonly servicesTotal = signal(0);
  readonly servicesPage = signal(1);
  readonly servicesPageSize = signal(6);

  readonly contacts = signal<ContactDetail[]>([]);
  readonly contactsTotal = signal(0);
  readonly contactsPage = signal(1);
  readonly contactsPageSize = signal(5);

  readonly contactStatusOptions: Array<{ label: string; value: ContactStatusFilter }> = [
    { label: 'Todas las solicitudes', value: 'ALL' },
    { label: 'Nuevas', value: 'NEW' },
    { label: 'En proceso', value: 'IN_PROCESS' },
    { label: 'Completadas', value: 'COMPLETED' },
    { label: 'Sin interés', value: 'NO_INTEREST' },
  ];

  readonly contactStatusControl: FormControl<ContactStatusFilter> =
    this.fb.nonNullable.control('ALL');

  constructor() {
    if (!this.sellerId) {
      this.errorMessage.set('No pudimos identificar tu cuenta. Iniciá sesión nuevamente.');
      this.initialLoading.set(false);
      return;
    }

    this.contactStatusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.contactsPage.set(1);
        this.loadContacts();
      });

    this.initialize();
  }

  async initialize(): Promise<void> {
    if (!this.sellerId) return;

    try {
      await Promise.all([this.loadServiceStats(), this.loadServices(), this.loadContacts()]);
    } catch (error) {
      console.error('Error loading dashboard data', error);
      this.errorMessage.set('No pudimos cargar tu panel de control. Intenta nuevamente más tarde.');
      this.messageService.add({
        severity: 'error',
        summary: 'Error al cargar panel',
        detail: 'Ocurrió un problema al cargar tus datos.',
        life: 4000,
      });
    } finally {
      this.initialLoading.set(false);
    }
  }

  async loadServices(): Promise<void> {
    if (!this.sellerId) return;

    try {
      this.servicesLoading.set(true);

      const response = await this.catalogService.searchServices({
        sellerId: this.sellerId,
        page: this.servicesPage(),
        limit: this.servicesPageSize(),
        sortBy: 'date_desc',
      });

      this.services.set(response.services);
      this.servicesTotal.set(response.total);
      this.updateStats({ activeServices: response.total });
    } catch (error) {
      console.error('Error loading services', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al listar servicios',
        detail: 'Revisa tu conexión e intenta nuevamente.',
        life: 3500,
      });
      this.services.set([]);
      this.servicesTotal.set(0);
    } finally {
      this.servicesLoading.set(false);
    }
  }

  async loadServiceStats(): Promise<void> {
    if (!this.sellerId) return;

    try {
      const limit = 20;
      let page = 1;
      let totalServices = 0;
      let fetched = 0;
      let accumulatedPrice = 0;

      do {
        const response = await this.catalogService.searchServices({
          sellerId: this.sellerId,
          page,
          limit,
          sortBy: 'date_desc',
        });

        if (page === 1) {
          totalServices = response.total;
        }

        const currentBatch = response.services.length;

        if (!currentBatch) {
          totalServices = fetched;
          break;
        }

        accumulatedPrice += response.services.reduce((sum, service) => sum + service.basePrice, 0);
        fetched += currentBatch;
        page += 1;
      } while (fetched < totalServices);

      const averagePrice = totalServices ? accumulatedPrice / totalServices : 0;

      this.updateStats({
        activeServices: totalServices,
        averagePrice,
      });

      const newContacts = await this.userService.getSellerContacts(this.sellerId, {
        status: 'NEW',
        page: 1,
        limit,
      });

      this.updateStats({ newLeads: newContacts.total });
    } catch (error) {
      console.error('Error loading service metrics', error);
    }
  }

  async loadContacts(): Promise<void> {
    if (!this.sellerId) return;

    try {
      this.contactsLoading.set(true);

      const status = this.contactStatusControl.value;
      const response = await this.userService.getSellerContacts(this.sellerId, {
        status: status === 'ALL' ? undefined : status,
        page: this.contactsPage(),
        limit: this.contactsPageSize(),
      });

      this.contacts.set(response.items);
      this.contactsTotal.set(response.total);
      this.updateStats({ totalLeads: response.total });
    } catch (error) {
      console.error('Error loading contacts', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al cargar consultas',
        detail: 'No pudimos obtener tus contactos recientes.',
        life: 3500,
      });
      this.contacts.set([]);
      this.contactsTotal.set(0);
    } finally {
      this.contactsLoading.set(false);
    }
  }

  onServicesPageChange(event: PaginatorState): void {
    const nextPage = (event.page ?? 0) + 1;
    const rows = event.rows ?? this.servicesPageSize();
    this.servicesPage.set(nextPage);
    this.servicesPageSize.set(rows);
    this.loadServices();
  }

  onContactsPageChange(event: PaginatorState): void {
    const nextPage = (event.page ?? 0) + 1;
    const rows = event.rows ?? this.contactsPageSize();
    this.contactsPage.set(nextPage);
    this.contactsPageSize.set(rows);
    this.loadContacts();
  }

  resolvePriceLabel(service: ServiceItem): string {
    switch (service.priceType) {
      case 'per_hour':
        return 'Por hora';
      case 'per_project':
        return 'Por proyecto';
      case 'per_day':
        return 'Por día';
      case 'per_month':
        return 'Por mes';
      default:
        return 'Precio base';
    }
  }

  resolveContactStatusLabel(status: ContactStatusValue): string {
    const labels: Record<ContactStatusValue, string> = {
      NEW: 'Nueva',
      SEEN: 'Vista',
      IN_PROCESS: 'En proceso',
      COMPLETED: 'Completada',
      NO_INTEREST: 'Sin interés',
      SERVICE_DELETED: 'Servicio eliminado',
      SELLER_INACTIVE: 'Vendedor inactivo',
    };
    return labels[status];
  }

  resolveContactSeverity(
    status: ContactStatusValue
  ): 'success' | 'info' | 'warn' | 'secondary' | 'danger' {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'IN_PROCESS':
        return 'warn';
      case 'COMPLETED':
        return 'success';
      case 'NO_INTEREST':
        return 'secondary';
      default:
        return 'danger';
    }
  }

  private updateStats(partial: Partial<DashboardStats>): void {
    this.stats.update((current) => ({ ...current, ...partial }));
  }
}
