import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CatalogService } from '../../../../shared/services/catalog.service';
import type { ServiceItem } from '../../../../shared/types/service';
import { ContentReportReason, REPORT_REASON_OPTIONS } from '../../../../shared/types/report';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';
import { WsService } from '../../../../shared/services/ws.service';
import { MainStore } from '../../../../shared/stores/main.store';

interface GalleryItem {
  alt: string;
  src: string;
}

@Component({
  selector: 'app-detail-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ChipModule,
    TagModule,
    DividerModule,
    DialogModule,
    GalleriaModule,
    SelectModule,
    InputTextModule,
    SkeletonModule,
    UyuCurrencyPipe,
  ],
  templateUrl: './detail-services.pages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailServicesPages {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);
  private readonly wsService = inject(WsService);

  readonly mainStore = inject(MainStore);
  readonly loading = signal(true);
  readonly service = signal<ServiceItem | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly galleryItems = signal<GalleryItem[]>([]);

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

  readonly reportReasonOptions = [...REPORT_REASON_OPTIONS];
  readonly maxReportDetailsLength = 300;
  readonly reportDialogVisible = signal(false);
  readonly reportSubmitting = signal(false);
  readonly reportForm: FormGroup<{
    reason: FormControl<ContentReportReason | null>;
    details: FormControl<string>;
    otherReasonText: FormControl<string>;
    email: FormControl<string>;
  }> = this.fb.group({
    reason: this.fb.control<ContentReportReason | null>(null, {
      validators: [Validators.required],
    }),
    details: this.fb.nonNullable.control('', {
      validators: [Validators.maxLength(this.maxReportDetailsLength)],
    }),
    otherReasonText: this.fb.nonNullable.control('', {
      validators: [Validators.maxLength(this.maxReportDetailsLength)],
    }),
    email: this.fb.nonNullable.control('', {
      validators: [Validators.email],
    }),
  });

  readonly selectedReasonDescription = computed(() => {
    const selected = this.reportForm.controls.reason.value;
    if (!selected) return '';
    return this.reportReasonOptions.find((option) => option.value === selected)?.description ?? '';
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

    this.reportForm.controls.reason.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const otherControl = this.reportForm.controls.otherReasonText;
        if (value === 'OTHER') {
          otherControl.addValidators(Validators.required);
        } else {
          otherControl.removeValidators(Validators.required);
          otherControl.setValue('', { emitEvent: false });
        }
        otherControl.updateValueAndValidity({ emitEvent: false });
      });
  }

  async refresh(): Promise<void> {
    const currentId = this.service()?.id;
    if (!currentId) return;
    await this.loadService(currentId);
  }

  private reloadEffect = effect(async () => {
    const serviceToReload = this.service();
    const shouldReload = this.wsService.shouldServiceReload();

    if (shouldReload.reload && serviceToReload && shouldReload.serviceId === serviceToReload.id) {
      await this.refresh();

      this.wsService.shouldServiceReload.set({
        serviceId: -1,
        reload: false,
      });
    }
  });

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

  openReportDialog(): void {
    if (!this.service()) {
      return;
    }
    this.resetReportForm();
    this.reportDialogVisible.set(true);
  }

  closeReportDialog(): void {
    this.reportDialogVisible.set(false);
    this.resetReportForm();
  }

  onReportDialogVisibleChange(visible: boolean): void {
    this.reportDialogVisible.set(visible);
    if (!visible) {
      this.resetReportForm();
    }
  }

  async submitReport(): Promise<void> {
    const currentService = this.service();
    if (!currentService) {
      return;
    }

    const reason = this.reportForm.controls.reason.value;
    if (!reason) {
      this.reportForm.markAllAsTouched();
      return;
    }

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const otherReasonText = this.reportForm.controls.otherReasonText.value.trim();
    const details = this.reportForm.controls.details.value.trim();
    const reporterEmail = this.reportForm.controls.email.value.trim();

    const payload = {
      reason,
      details: details.length ? details : undefined,
      otherReasonText: reason === 'OTHER' ? otherReasonText : undefined,
      reporterEmail: reporterEmail.length ? reporterEmail : undefined,
    };

    this.reportSubmitting.set(true);
    try {
      await this.catalogService.reportService(currentService.id, payload);
      this.messageService.add({
        severity: 'success',
        summary: 'Reporte enviado',
        detail: 'Gracias por ayudarnos a mantener la plataforma segura.',
        life: 3500,
      });
      this.closeReportDialog();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos enviar tu reporte',
        detail: 'Intenta nuevamente en unos minutos.',
        life: 4000,
      });
    } finally {
      this.reportSubmitting.set(false);
    }
  }

  private resetReportForm(): void {
    this.reportForm.reset({
      reason: null,
      details: '',
      otherReasonText: '',
      email: '',
    });
  }

  private async loadService(serviceId: number): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const service = await this.catalogService.getService(serviceId);
      if (!service.isActive) {
        this.handleError('Este servicio no está disponible o fue dado de baja.');
        return;
      }

      this.service.set(service);
      this.populateGalleryItems(service);
    } catch (error: unknown) {
      this.handleError('No pudimos cargar el servicio solicitado.');
    } finally {
      this.loading.set(false);
    }
  }

  private handleError(message: string): void {
    this.errorMessage.set(message);
    this.service.set(null);
    this.galleryItems.set([]);
    this.messageService.add({
      severity: 'error',
      summary: 'Servicio no disponible',
      detail: message,
      life: 3500,
    });
  }

  private populateGalleryItems(service: ServiceItem): void {
    if (!service.images.length) {
      this.galleryItems.set([]);
      return;
    }

    const items = service.images.map((image, index) => ({
      alt: `Imagen ${index + 1} de ${service.title}`,
      src: image.imageUrl,
    }));

    this.galleryItems.set(items);
  }
}
