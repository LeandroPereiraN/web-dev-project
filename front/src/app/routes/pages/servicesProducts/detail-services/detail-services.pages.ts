import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CatalogService } from '../../../../shared/services/catalog.service';
import type { ServiceItem } from '../../../../shared/types/service';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';

interface GalleryItem {
  alt: string;
  src: string;
}

@Component({
  selector: 'app-detail-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ChipModule,
    TagModule,
    DividerModule,
    GalleriaModule,
    SkeletonModule,
    UyuCurrencyPipe,
  ],
  templateUrl: './detail-services.pages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailServicesPages {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);

  readonly loading = signal(true);
  readonly service = signal<ServiceItem | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly galleryItems = computed<GalleryItem[]>(() => {
    const current = this.service();
    if (!current || !current.images.length) {
      return [
        {
          alt: 'Servicio sin imágenes disponibles',
          src: 'https://images.unsplash.com/photo-1520881363902-a0ff4e722963?auto=format&fit=crop&w=1200&q=80',
        },
      ];
    }

    return current.images.map((image, index) => ({
      alt: `Imagen ${index + 1} de ${current.title}`,
      src: image.imageUrl,
    }));
  });

  readonly createdAt = computed(() => {
    const current = this.service();
    if (!current) return null;
    return new Date(current.createdAt).toLocaleDateString('es-UY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  readonly priceBadge = computed(() => {
    const current = this.service();
    if (!current) return null;
    return `${current.basePrice}`;
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const idParam = params.get('id');
      const serviceId = Number(idParam);

      if (!serviceId || Number.isNaN(serviceId)) {
        this.handleError('Identificador de servicio inválido.');
        return;
      }

      this.loadService(serviceId);
    });
  }

  async refresh(): Promise<void> {
    const currentId = this.service()?.id;
    if (!currentId) return;
    await this.loadService(currentId);
  }

  navigateBack(): void {
    this.location.back();
  }

  resolvePriceLabel(): string {
    const current = this.service();
    if (!current) return '';
    switch (current.priceType) {
      case 'per_hour':
        return 'Tarifa por hora';
      case 'per_project':
        return 'Tarifa por proyecto';
      case 'per_day':
        return 'Tarifa por día';
      case 'per_month':
        return 'Tarifa por mes';
      default:
        return 'Precio base sugerido';
    }
  }

  resolveMaterials(): string {
    const current = this.service();
    if (!current) return 'El proveedor indicará qué materiales se requieren.';
    return current.materialsIncluded || 'Incluye asesoramiento sobre materiales necesarios.';
  }

  resolveEstimatedTime(): string {
    const current = this.service();
    if (!current) return 'Coordinaremos el tiempo estimado durante el contacto.';
    return current.estimatedTime || 'El tiempo estimado se definirá según el alcance del trabajo.';
  }

  private async loadService(serviceId: number): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const service = await this.catalogService.getService(serviceId);
      this.service.set(service);
    } catch (error: unknown) {
      this.handleError('No pudimos cargar el servicio solicitado.');
    } finally {
      this.loading.set(false);
    }
  }

  private handleError(message: string): void {
    this.errorMessage.set(message);
    this.service.set(null);
    this.messageService.add({
      severity: 'error',
      summary: 'Servicio no disponible',
      detail: message,
      life: 3500,
    });
  }
}
