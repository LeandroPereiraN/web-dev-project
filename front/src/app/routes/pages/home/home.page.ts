import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CatalogService } from '../../../shared/services/catalog.service';
import type { CategoryItem, ServiceItem, ServiceListResponse } from '../../../shared/types/service';
import { UyuCurrencyPipe } from '../../../shared/pipes/uyu-currency.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ChipModule,
    InputTextModule,
    TagModule,
    UyuCurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
})
export class HomePage {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly categories = signal<CategoryItem[]>([]);
  readonly featuredServices = signal<ServiceItem[]>([]);
  readonly heroSearch = signal('');
  readonly errorMessage = signal<string | null>(null);

  readonly hasResults = computed(() => this.featuredServices().length > 0);

  constructor() {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const [categories, services] = await Promise.all([
        this.catalogService.getCategories(),
        this.catalogService.searchServices({ limit: 6, sortBy: 'rating_desc' }),
      ]);

      this.categories.set(categories);
      this.featuredServices.set(services.services);
    } catch (error) {
      console.log(error);
      console.error('Error loading home data', error);
      this.errorMessage.set('No pudimos cargar la información inicial.');
    } finally {
      this.loading.set(false);
    }
  }

  async submitSearch(): Promise<void> {
    const search = this.heroSearch().trim();
    const queryParams = search ? { search } : {};
    await this.router.navigate(['/services'], { queryParams });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.heroSearch.set(target?.value ?? '');
  }

  async goToCategory(category: CategoryItem): Promise<void> {
    await this.router.navigate(['/services'], { queryParams: { category: category.id } });
  }

  trackByCategory = (_: number, category: CategoryItem) => category.id;

  trackByService = (_: number, service: ServiceItem) => service.id;

  resolvePriceLabel(priceType: ServiceItem['priceType']): string {
    switch (priceType) {
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

  resolvePrimaryImageStyle(service: ServiceItem): string {
    const imageUrl = service.images[0]?.imageUrl;
    if (imageUrl) {
      return `url(${imageUrl})`;
    }

    return 'linear-gradient(135deg, rgba(14,116,144,0.4), rgba(59,130,246,0.35))';
  }
}
