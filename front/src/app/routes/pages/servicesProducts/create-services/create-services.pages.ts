import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { CatalogService } from '../../../../shared/services/catalog.service';
import { ServiceManagementService } from '../../../../shared/services/service-management.service';
import type { CategoryItem, PriceType } from '../../../../shared/types/service';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';

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

@Component({
  selector: 'app-create-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    UyuCurrencyPipe,
  ],
  templateUrl: './create-services.pages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServicesPages {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly serviceManagement = inject(ServiceManagementService);
  private readonly messageService = inject(MessageService);

  readonly loadingCategories = signal(true);
  readonly submitting = signal(false);
  readonly categories = signal<CategoryItem[]>([]);
  readonly categoryOptions = computed(() =>
    this.categories().map((category) => ({
      label: category.name,
      value: category.id,
    })),
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
    basePrice: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    priceType: this.fb.nonNullable.control<PriceType>('per_project', Validators.required),
    estimatedTime: this.fb.nonNullable.control('', Validators.maxLength(120)),
    materialsIncluded: this.fb.nonNullable.control('', Validators.maxLength(200)),
    images: this.fb.array<FormControl<string>>([
      this.fb.nonNullable.control(''),
    ]),
  });

  constructor() {
    this.loadCategories();
  }

  get imageArray(): FormArray<FormControl<string>> {
    return this.form.controls.images;
  }

  addImageField(): void {
    if (this.imageArray.length >= 3) {
      this.messageService.add({
        severity: 'info',
        summary: 'Límite alcanzado',
        detail: 'Podés cargar hasta 3 imágenes por servicio.',
        life: 2500,
      });
      return;
    }

    this.imageArray.push(this.fb.nonNullable.control(''));
  }

  removeImageField(index: number): void {
    if (this.imageArray.length === 1) {
      this.imageArray.at(0)?.setValue('');
      return;
    }

    this.imageArray.removeAt(index);
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      title,
      description,
      categoryId,
      basePrice,
      priceType,
      estimatedTime,
      materialsIncluded,
    } = this.form.getRawValue();

    if (categoryId === null || basePrice === null) {
      this.form.markAllAsTouched();
      return;
    }

    const images = this.imageArray.controls
      .map((control) => control.value.trim())
      .filter((url) => url.length > 0);

    this.submitting.set(true);

    try {
      const newService = await this.serviceManagement.createService({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        basePrice,
        priceType,
        estimatedTime: estimatedTime.trim() || null,
        materialsIncluded: materialsIncluded.trim() || null,
        images,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Servicio creado',
        detail: 'Tu servicio está publicado y listo para recibir solicitudes.',
        life: 3500,
      });

      await this.router.navigate(['/services', newService.id]);
    } catch (error: unknown) {
      console.error('Error creating service', error);
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos crear el servicio',
        detail: 'Revisá los datos ingresados e intentá nuevamente.',
        life: 4000,
      });
    } finally {
      this.submitting.set(false);
    }
  }

  private loadCategories(): void {
    this.loadingCategories.set(true);

    this.catalogService
      .getCategories()
      .then((categories) => {
        this.categories.set(categories);
      })
      .catch((error) => {
        console.error('Error loading categories', error);
        this.messageService.add({
          severity: 'error',
          summary: 'No pudimos obtener las categorías',
          detail: 'Ingresa nuevamente más tarde.',
        });
      })
      .finally(() => this.loadingCategories.set(false));
  }
}
