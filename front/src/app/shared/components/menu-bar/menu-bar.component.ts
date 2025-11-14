import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { MainStore } from '../../stores/main.store';
import { AuthService } from '../../services/auth.service';
import { CatalogService } from '../../services/catalog.service';
import type { CategoryItem } from '../../types/service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ButtonModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-bar.component.html',
})
export class MenuBarComponent {
  private router = inject(Router);
  private mainStore = inject(MainStore);
  private authService = inject(AuthService);
  private catalogService = inject(CatalogService);

  items: MenuItem[] = [];

  isAuthenticated = this.mainStore.isAuthenticated;
  isSeller = this.mainStore.isSeller;
  isAdmin = this.mainStore.isAdmin;
  readonly categories = signal<CategoryItem[]>([]);

  constructor() {
    effect(
      () => {
        this.items = this.buildMenuItems();
      },
      { allowSignalWrites: true }
    );
    this.loadCategories();
  }

  private buildMenuItems(): MenuItem[] {
    const categories = this.categories();

    const baseItems: MenuItem[] = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/home',
      },
      {
        label: 'Servicios',
        icon: 'pi pi-briefcase',
        items: this.buildServicesMenu(categories),
      },
    ];

    if (this.isAuthenticated()) {
      if (this.isSeller()) {
        baseItems.push({
          label: 'Panel vendedor',
          icon: 'pi pi-briefcase',
          routerLink: '/dashboard',
        });
      } else if (this.isAdmin()) {
        baseItems.push({
          label: 'Moderación',
          icon: 'pi pi-shield',
          items: [
            {
              label: 'Reportes',
              icon: 'pi pi-flag',
              routerLink: '/admin/reports',
            },
            {
              label: 'Vendedores reportados',
              icon: 'pi pi-users',
              routerLink: '/admin/reported-sellers',
            },
            {
              label: 'Publicaciones pendientes',
              icon: 'pi pi-eye',
              routerLink: '/admin/moderations',
            },
          ],
        });
      }

      // Menú de usuario logueado
      baseItems.push({
        label: 'Mi Cuenta',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Perfil',
            icon: 'pi pi-id-card',
            routerLink: '/profile',
          },
          {
            label: 'Editar perfil',
            icon: 'pi pi-user-edit',
            routerLink: '/profile/edit',
          },
          {
            label: 'Eliminar cuenta',
            icon: 'pi pi-user-minus',
            routerLink: '/profile/delete',
          },
          {
            separator: true,
          },
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      });
    }

    return baseItems;
  }

  private buildServicesMenu(categories: CategoryItem[]): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'Catálogo de servicios',
        icon: 'pi pi-list',
        routerLink: '/services',
      },
    ];

    if (categories.length) {
      items.push({
        label: 'Por categoría',
        icon: 'pi pi-filter',
        items: categories.map((category) => ({
          label: category.name,
          icon: 'pi pi-tag',
          routerLink: '/services',
          queryParams: { category: category.id },
        })),
      });
    }

    items.push(
      { separator: true },
      {
        label: 'Servicios destacados',
        icon: 'pi pi-star',
        routerLink: '/services',
        queryParams: { featured: 'true' },
      }
    );

    return items;
  }

  private async loadCategories(): Promise<void> {
    try {
      const categories = await this.catalogService.getCategories();
      this.categories.set(categories);
    } catch (error) {
      console.error('Error loading categories for menu', error);
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  createService() {
    this.router.navigate(['/my-services/create']);
  }
}
