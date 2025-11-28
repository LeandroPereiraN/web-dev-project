import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import type { PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { CatalogService } from '../../../../shared/services/catalog.service';
import type {
  CategoryItem,
  ServiceItem,
  ServiceSearchParams,
} from '../../../../shared/types/service';
import { ContentReportReason, REPORT_REASON_OPTIONS } from '../../../../shared/types/report';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';
import { MainStore } from '../../../../shared/stores/main.store';

type Option<T> = { label: string; value: T };
type CategoryOption = Option<number | null>;

@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    PaginatorModule,
    SkeletonModule,
    TagModule,
    UyuCurrencyPipe,
    CheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-services.pages.html',
})
export class ListServicesPages {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly catalogService = inject(CatalogService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  readonly mainStore = inject(MainStore);

  readonly categories = signal<CategoryItem[]>([]);
  readonly categoryOptions = computed((): CategoryOption[] => [
    { label: 'Todas las categorías', value: null },
    ...this.categories().map((category) => ({ label: category.name, value: category.id })),
  ]);
  readonly services = signal<ServiceItem[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly page = signal(1);
  readonly pageSize = signal(6);
  readonly sortBy = signal<ServiceSearchParams['sortBy']>('date_desc');
  readonly hasResults = computed(() => this.services().length > 0);
  readonly reportReasonOptions = [...REPORT_REASON_OPTIONS];
  readonly maxReportDetailsLength = 300;
  readonly reportDialogVisible = signal(false);
  readonly reportSubmitting = signal(false);
  readonly reportTarget = signal<ServiceItem | null>(null);
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

  readonly sortOptions: Array<Option<ServiceSearchParams['sortBy']>> = [
    { label: 'Más recientes', value: 'date_desc' },
    { label: 'Precio más bajo', value: 'price_asc' },
    { label: 'Precio más alto', value: 'price_desc' },
  ];

  readonly filtersForm: FormGroup<{
    search: FormControl<string | null>;
    categoryId: FormControl<number | null>;
    minPrice: FormControl<number | null>;
    maxPrice: FormControl<number | null>;
    sortBy: FormControl<ServiceSearchParams['sortBy']>;
    notViewMyServices: FormControl<boolean | null>;
  }> = this.fb.group({
    search: this.fb.control('', { nonNullable: false }),
    categoryId: this.fb.control<number | null>(null),
    minPrice: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    maxPrice: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    sortBy: this.fb.nonNullable.control<ServiceSearchParams['sortBy']>('date_desc'),
    notViewMyServices: this.fb.control<boolean | null>(false),
  });

  constructor() {
    this.initialize();
    this.filtersForm.controls.sortBy.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const nextValue = value ?? 'date_desc';
        if (this.sortBy() === nextValue) {
          return;
        }
        this.sortBy.set(nextValue);
        this.applyFilters();
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

  private initialize(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const parsed = this.mapQueryParams(params);
      this.syncForm(parsed);
      this.page.set(parsed.page ?? 1);
      this.pageSize.set(parsed.limit ?? 6);
      this.sortBy.set(parsed.sortBy ?? 'date_desc');
      this.loadServices(parsed);
    });

    effect(
      async () => {
        try {
          const categories = await this.catalogService.getCategories();
          this.categories.set(categories);
        } catch (error) {
          console.error('Error loading categories', error);
        }
      },
      { allowSignalWrites: true }
    );
  }

  private syncForm(params: ServiceSearchParams): void {
    this.filtersForm.patchValue(
      {
        search: params.search ?? null,
        categoryId: params.categoryId ?? null,
        minPrice: params.minPrice ?? null,
        maxPrice: params.maxPrice ?? null,
        sortBy: params.sortBy ?? 'date_desc',
        notViewMyServices: params.notViewMyServices ?? false,
      },
      { emitEvent: false }
    );
  }

  private mapQueryParams(params: Params | URLSearchParams | any): ServiceSearchParams {
    const get = (key: string) => (params.get ? params.get(key) : params[key]);

    const mapped: ServiceSearchParams = {};

    const search = get('search');
    if (search) mapped.search = String(search);

    const category = get('category') ?? get('category_id');
    if (category) mapped.categoryId = Number(category);

    const minPrice = get('min_price');
    if (minPrice) mapped.minPrice = Number(minPrice);

    const maxPrice = get('max_price');
    if (maxPrice) mapped.maxPrice = Number(maxPrice);

    const sort = get('sort_by');
    if (sort) mapped.sortBy = sort as ServiceSearchParams['sortBy'];

    const notViewMyServices = get('notViewMyServices');
    if (notViewMyServices) mapped.notViewMyServices = notViewMyServices === 'true';

    const page = get('page');
    if (page) mapped.page = Number(page);

    const limit = get('limit');
    if (limit) mapped.limit = Number(limit);

    return mapped;
  }

  private async loadServices(params: ServiceSearchParams): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const request: ServiceSearchParams = {
        ...params,
        page: params.page ?? this.page(),
        limit: params.limit ?? this.pageSize(),
        sortBy: params.sortBy ?? this.sortBy(),
      };

      const response = await this.catalogService.searchServices(request);
      this.services.set(response.services);
      this.total.set(response.total);
      this.page.set(response.page);
      this.pageSize.set(response.limit);
    } catch (error) {
      console.error('Error loading services', error);
      this.errorMessage.set('No pudimos obtener los servicios. Intenta nuevamente.');
      this.services.set([]);
      this.total.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters(): void {
    this.page.set(1);
    const query = this.buildQueryParams({ page: 1, limit: this.pageSize() });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
    });
  }

  clearFilters(): void {
    this.filtersForm.reset(
      {
        search: null,
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        sortBy: 'date_desc',
        notViewMyServices: false,
      },
      { emitEvent: false }
    );
    this.sortBy.set('date_desc');
    this.page.set(1);
    this.pageSize.set(6);
    const query = this.buildQueryParams({
      search: null,
      category: null,
      min_price: null,
      max_price: null,
      sort_by: 'date_desc',
      page: 1,
      limit: this.pageSize(),
      notViewMyServices: false,
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
    });
  }

  onPageChange(event: PaginatorState): void {
    const currentPage = (event.page ?? 0) + 1;
    const limit = event.rows ?? this.pageSize();
    this.page.set(currentPage);
    this.pageSize.set(limit);
    const query = this.buildQueryParams({ page: currentPage, limit });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
    });
  }

  resolvePriceLabel(service: ServiceItem): string {
    switch (service.priceType) {
      case 'per_hour':
        return 'por hora';
      case 'per_project':
        return 'por proyecto';
      case 'per_day':
        return 'por día';
      case 'per_month':
        return 'por mes';
      default:
        return 'precio base';
    }
  }

  resolvePrimaryImage(service: ServiceItem): string {
    const imageUrl = service.images[0]?.imageUrl;
    if (imageUrl) {
      return `url(${imageUrl})`;
    }

    return 'url(https://th.bing.com/th/id/OIP.wC3hEpBVbX0fydfoTExQIAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3)';
  }

  trackByService = (_: number, service: ServiceItem) => service.id;

  openReportDialog(service: ServiceItem): void {
    this.reportTarget.set(service);
    this.resetReportForm();
    this.reportDialogVisible.set(true);
  }

  closeReportDialog(): void {
    this.reportDialogVisible.set(false);
    this.reportTarget.set(null);
    this.resetReportForm();
  }

  onReportDialogVisibleChange(visible: boolean): void {
    this.reportDialogVisible.set(visible);
    if (!visible) {
      this.reportTarget.set(null);
      this.resetReportForm();
    }
  }

  async submitReport(): Promise<void> {
    const currentService = this.reportTarget();
    if (!currentService) return;

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
        detail: `Gracias por avisarnos sobre "${currentService.title}".`,
        life: 3500,
      });
      this.closeReportDialog();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos enviar el reporte',
        detail: 'Intentá nuevamente más tarde.',
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

  private buildQueryParams(overrides: Partial<Params> = {}): Params {
    const { search, categoryId, minPrice, maxPrice, notViewMyServices } =
      this.filtersForm.getRawValue();
    const trimmedSearch = search?.trim() ?? '';

    const base: Params = {
      search: trimmedSearch.length ? trimmedSearch : undefined,
      category: categoryId ?? undefined,
      min_price: minPrice ?? undefined,
      max_price: maxPrice ?? undefined,
      sort_by: this.sortBy(),
      page: this.page(),
      limit: this.pageSize(),
      notViewMyServices: notViewMyServices ?? false,
    };

    const merged: Params = { ...base, ...overrides };

    Object.keys(merged).forEach((key) => {
      const value = merged[key];
      if (value === null || value === undefined || value === '') {
        delete merged[key];
      }
    });

    return merged;
  }
}
