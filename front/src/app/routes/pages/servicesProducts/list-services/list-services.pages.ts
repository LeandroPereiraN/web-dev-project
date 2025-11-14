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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import type { PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { CatalogService } from '../../../../shared/services/catalog.service';
import type {
  CategoryItem,
  ServiceItem,
  ServiceSearchParams,
} from '../../../../shared/types/service';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';

type Option<T> = { label: string; value: T };
type CategoryOption = Option<number | null>;

@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    PaginatorModule,
    SkeletonModule,
    TagModule,
    UyuCurrencyPipe,
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

  readonly priceTypes = [
    { label: 'Cualquier modalidad', value: null },
    { label: 'Por hora', value: 'per_hour' },
    { label: 'Por proyecto', value: 'per_project' },
    { label: 'Por día', value: 'per_day' },
    { label: 'Por mes', value: 'per_month' },
    { label: 'Otro', value: 'other' },
  ] as const;

  readonly sortOptions: Array<Option<ServiceSearchParams['sortBy']>> = [
    { label: 'Más recientes', value: 'date_desc' },
    { label: 'Precio más bajo', value: 'price_asc' },
    { label: 'Precio más alto', value: 'price_desc' },
    { label: 'Mejor calificados', value: 'rating_desc' },
  ];

  readonly filtersForm: FormGroup<{
    search: FormControl<string | null>;
    categoryId: FormControl<number | null>;
    minPrice: FormControl<number | null>;
    maxPrice: FormControl<number | null>;
  }> = this.fb.group({
    search: this.fb.control('', { nonNullable: false }),
    categoryId: this.fb.control<number | null>(null),
    minPrice: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    maxPrice: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
  });

  constructor() {
    this.initialize();
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
    this.filtersForm.reset({ search: null, categoryId: null, minPrice: null, maxPrice: null });
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
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
    });
  }

  onSortChange(value: ServiceSearchParams['sortBy']): void {
    this.sortBy.set(value);
    this.applyFilters();
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

    return 'linear-gradient(135deg, rgba(15,118,110,0.45), rgba(14,116,144,0.3))';
  }

  trackByService = (_: number, service: ServiceItem) => service.id;

  private buildQueryParams(overrides: Partial<Params> = {}): Params {
    const { search, categoryId, minPrice, maxPrice } = this.filtersForm.getRawValue();
    const trimmedSearch = search?.trim() ?? '';

    const base: Params = {
      search: trimmedSearch.length ? trimmedSearch : null,
      category: categoryId ?? null,
      min_price: minPrice ?? null,
      max_price: maxPrice ?? null,
      sort_by: this.sortBy(),
      page: this.page(),
      limit: this.pageSize(),
    };

    return { ...base, ...overrides };
  }
}
