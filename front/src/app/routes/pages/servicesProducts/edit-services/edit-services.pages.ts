import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';
import { CatalogService } from '../../../../shared/services/catalog.service';
import { ServiceManagementService } from '../../../../shared/services/service-management.service';
import type {
  CategoryItem,
  PriceType,
  ServiceItem,
  ServiceUpdatePayload,
} from '../../../../shared/types/service';

type ServiceFormControls = {
  title: FormControl<string>;
  description: FormControl<string>;
  categoryId: FormControl<number | null>;
  basePrice: FormControl<number | null>;
  priceType: FormControl<PriceType>;
  estimatedTime: FormControl<string>;
  materialsIncluded: FormControl<string>;
  images: FormArray<FormControl<string>>;
};

type ServiceFormValue = {
  title: string;
  description: string;
  categoryId: number | null;
  basePrice: number | null;
  priceType: PriceType;
  estimatedTime: string;
  materialsIncluded: string;
  images: string[];
};

@Component({
  selector: 'app-edit-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    SkeletonModule,
    UyuCurrencyPipe,
  ],
  templateUrl: './edit-services.pages.html',
})
export class EditServicesPages {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly serviceManagement = inject(ServiceManagementService);
  private readonly messageService = inject(MessageService);

  private readonly maxImages = 3;
  private serviceId: number | null = null;

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly loadingCategories = signal(false);
  readonly categories = signal<CategoryItem[]>([]);
  readonly service = signal<ServiceItem | null>(null);
  readonly statusUpdating = signal(false);

  readonly categoryOptions = computed(() =>
    this.categories().map((category) => ({
      label: category.name,
      value: category.id,
    }))
  );

  readonly priceTypes: Array<{ label: string; value: PriceType }> = [
    { label: 'Por proyecto', value: 'per_project' },
    { label: 'Por hora', value: 'per_hour' },
    { label: 'Por día', value: 'per_day' },
    { label: 'Por mes', value: 'per_month' },
    { label: 'Otro', value: 'other' },
  ];

  readonly form: FormGroup<ServiceFormControls> = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(500)]),
    categoryId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    basePrice: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    priceType: this.fb.nonNullable.control<PriceType>('per_project', Validators.required),
    estimatedTime: this.fb.nonNullable.control('', Validators.maxLength(120)),
    materialsIncluded: this.fb.nonNullable.control('', Validators.maxLength(200)),
    images: this.fb.array<FormControl<string>>([this.fb.nonNullable.control('')]),
  });

  readonly statusControl: FormControl<boolean> = this.fb.nonNullable.control(true);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(idParam);

    if (!idParam || Number.isNaN(parsedId) || parsedId <= 0) {
      this.handleMissingService();
      return;
    }

    this.serviceId = parsedId;
    void this.loadInitialData();
  }

  get imageArray(): FormArray<FormControl<string>> {
    return this.form.controls.images;
  }

  get hasChanges(): boolean {
    return this.form.dirty || this.imageArray.dirty || this.statusControl.dirty;
  }

  addImageField(): void {
    if (this.imageArray.length >= this.maxImages) {
      this.messageService.add({
        severity: 'info',
        summary: 'Límite alcanzado',
        detail: `Podés cargar hasta ${this.maxImages} imágenes por servicio.`,
        life: 2500,
      });
      return;
    }

    this.imageArray.push(this.fb.nonNullable.control(''));
  }

  removeImageField(index: number): void {
    if (this.imageArray.length === 1) {
      this.imageArray.at(0)?.setValue('');
      this.imageArray.markAsPristine();
      return;
    }

    this.imageArray.removeAt(index);
  }

  async toggleStatus(): Promise<void> {
    if (this.statusUpdating() || !this.serviceId) return;

    const currentService = this.service();
    if (!currentService) return;

    const previousStatus = currentService.isActive;
    const nextStatus = !previousStatus;

    this.statusUpdating.set(true);
    this.statusControl.setValue(nextStatus);

    try {
      const updated = await this.serviceManagement.updateService(currentService.id, {
        isActive: nextStatus,
      });
      this.service.set(updated);
      this.statusControl.setValue(updated.isActive, { emitEvent: false });
      this.statusControl.markAsPristine();
      this.statusControl.markAsUntouched();

      this.messageService.add({
        severity: nextStatus ? 'success' : 'info',
        summary: nextStatus ? 'Servicio reactivado' : 'Servicio pausado',
        detail: nextStatus
          ? 'Tu servicio vuelve a estar visible en el catálogo.'
          : 'Los clientes ya no verán este servicio hasta que lo actives.',
        life: 3000,
      });
    } catch (error: unknown) {
      console.error('Error changing service status', error);
      this.statusControl.setValue(previousStatus, { emitEvent: false });
      this.statusControl.markAsPristine();
      this.statusControl.markAsUntouched();
      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo cambiar el estado',
        detail: 'Intentá nuevamente más tarde.',
        life: 4000,
      });
    } finally {
      this.statusUpdating.set(false);
    }
  }

  resetForm(): void {
    const currentService = this.service();
    if (!currentService) return;

    this.patchForm(currentService);
    this.messageService.add({
      severity: 'info',
      summary: 'Cambios descartados',
      detail: 'Restauramos la última versión guardada del servicio.',
      life: 2000,
    });
  }

  async submit(): Promise<void> {
    if (!this.serviceId) return;

    const currentService = this.service();
    if (!currentService) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue() as ServiceFormValue;

    if (formValue.categoryId === null || formValue.basePrice === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildUpdatePayload(currentService, formValue, this.statusControl.value);

    if (!Object.keys(payload).length) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin cambios',
        detail: 'No registramos cambios para guardar.',
        life: 2000,
      });
      return;
    }

    this.submitting.set(true);

    try {
      const updated = await this.serviceManagement.updateService(currentService.id, payload);
      this.service.set(updated);
      this.patchForm(updated);

      this.messageService.add({
        severity: 'success',
        summary: 'Servicio actualizado',
        detail: 'Tus cambios se guardaron correctamente.',
        life: 3000,
      });
    } catch (error: unknown) {
      console.error('Error updating service', error);
      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: 'Revisá los datos e intentá nuevamente.',
        life: 4000,
      });
    } finally {
      this.submitting.set(false);
    }
  }

  private async loadInitialData(): Promise<void> {
    if (!this.serviceId) return;

    this.loading.set(true);
    this.loadError.set(null);
    this.loadingCategories.set(true);

    const [serviceResult, categoriesResult] = await Promise.allSettled([
      this.catalogService.getService(this.serviceId),
      this.catalogService.getCategories(),
    ]);

    if (serviceResult.status === 'rejected') {
      console.error('Error loading service to edit', serviceResult.reason);
      this.loadError.set('No pudimos cargar la información del servicio que querías editar.');
      this.messageService.add({
        severity: 'error',
        summary: 'Servicio no disponible',
        detail: 'Verificá que el servicio exista o intentá más tarde.',
        life: 4000,
      });
      this.loading.set(false);
      this.loadingCategories.set(false);
      return;
    }

    const loadedService = serviceResult.value;
    this.service.set(loadedService);
    this.patchForm(loadedService);

    if (categoriesResult.status === 'fulfilled') {
      this.categories.set(categoriesResult.value);
    } else {
      console.error('Error loading categories', categoriesResult.reason);
      this.categories.set([]);
      this.messageService.add({
        severity: 'warn',
        summary: 'Categorías indisponibles',
        detail: 'No pudimos cargar las categorías. Podés intentar más tarde.',
        life: 3500,
      });
    }

    this.loading.set(false);
    this.loadingCategories.set(false);
  }

  private patchForm(service: ServiceItem): void {
    this.form.reset(
      {
        title: service.title,
        description: service.description,
        categoryId: service.categoryId,
        basePrice: service.basePrice,
        priceType: service.priceType,
        estimatedTime: service.estimatedTime ?? '',
        materialsIncluded: service.materialsIncluded ?? '',
      },
      { emitEvent: false }
    );

    this.setImageControls(service.images.map((image) => image.imageUrl));

    this.statusControl.setValue(service.isActive, { emitEvent: false });
    this.statusControl.markAsPristine();
    this.statusControl.markAsUntouched();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private setImageControls(imageUrls: string[]): void {
    this.imageArray.clear();

    if (!imageUrls.length) {
      this.imageArray.push(this.fb.nonNullable.control(''));
      this.imageArray.markAsPristine();
      this.imageArray.markAsUntouched();
      return;
    }

    imageUrls.forEach((url) => this.imageArray.push(this.fb.nonNullable.control(url)));
    this.imageArray.markAsPristine();
    this.imageArray.markAsUntouched();
  }

  private buildUpdatePayload(
    service: ServiceItem,
    formValue: ServiceFormValue,
    isActive: boolean
  ): ServiceUpdatePayload {
    const payload: ServiceUpdatePayload = {};

    const trimmedTitle = formValue.title.trim();
    if (trimmedTitle !== service.title) {
      payload.title = trimmedTitle;
    }

    const trimmedDescription = formValue.description.trim();
    if (trimmedDescription !== service.description) {
      payload.description = trimmedDescription;
    }

    if (formValue.categoryId !== null && formValue.categoryId !== service.categoryId) {
      payload.categoryId = formValue.categoryId;
    }

    if (formValue.basePrice !== null && formValue.basePrice !== service.basePrice) {
      payload.basePrice = formValue.basePrice;
    }

    if (formValue.priceType !== service.priceType) {
      payload.priceType = formValue.priceType;
    }

    const normalizedEstimatedTime = formValue.estimatedTime.trim() || null;
    const currentEstimated = service.estimatedTime ?? null;
    if (normalizedEstimatedTime !== currentEstimated) {
      payload.estimatedTime = normalizedEstimatedTime;
    }

    const normalizedMaterials = formValue.materialsIncluded.trim() || null;
    const currentMaterials = service.materialsIncluded ?? null;
    if (normalizedMaterials !== currentMaterials) {
      payload.materialsIncluded = normalizedMaterials;
    }

    const formImages = this.imageArray.controls
      .map((control) => control.value.trim())
      .filter((url) => url.length > 0);
    const currentImages = service.images.map((image) => image.imageUrl);

    if (!this.areStringArraysEqual(formImages, currentImages)) {
      payload.images = formImages;
    }

    if (isActive !== service.isActive) {
      payload.isActive = isActive;
    }

    return payload;
  }

  private areStringArraysEqual(first: string[], second: string[]): boolean {
    if (first.length !== second.length) return false;
    return first.every((value, index) => value === second[index]);
  }

  private handleMissingService(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Servicio no encontrado',
      detail: 'No pudimos identificar el servicio que querías editar.',
      life: 3500,
    });
    void this.router.navigate(['/my-services']);
  }
}
