import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    TooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css'
})
export class MenuBarComponent implements OnInit {

  items: MenuItem[] = [];
  readonly isLoggedIn = signal(false);
  readonly userType = signal<'seller' | 'admin' | null>(null); // seller, admin o null (para no logueado)

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.checkAuthenticationStatus();
    this.setupMenuItems();
  }

  private setupMenuItems() {
    // Las categorías después van a venir por base de datos.

    const baseItems: MenuItem[] = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'Servicios',
        icon: 'pi pi-briefcase',
        items: [
          {
            label: 'Catálogo de servicios',
            icon: 'pi pi-list',
            routerLink: '/services'
          },
          {
            label: 'Por categoría',
            icon: 'pi pi-filter',
            items: [
              {
                label: 'Plomería',
                icon: 'pi pi-wrench',
                routerLink: '/services',
                queryParams: { category: 'plumbing' }
              },
              {
                label: 'Electricidad',
                icon: 'pi pi-bolt',
                routerLink: '/services',
                queryParams: { category: 'electrical' }
              },
              {
                label: 'Carpintería',
                icon: 'pi pi-home',
                routerLink: '/services',
                queryParams: { category: 'carpentry' }
              },
              {
                label: 'Limpieza',
                icon: 'pi pi-refresh',
                routerLink: '/services',
                queryParams: { category: 'cleaning' }
              },
              {
                label: 'Jardinería',
                icon: 'pi pi-sun',
                routerLink: '/services',
                queryParams: { category: 'gardening' }
              },
              {
                label: 'Otros',
                icon: 'pi pi-ellipsis-h',
                routerLink: '/services',
                queryParams: { category: 'others' }
              }
            ]
          },
          {
            separator: true
          },
          {
            label: 'Servicios Destacados',
            icon: 'pi pi-star',
            routerLink: '/services',
            queryParams: { featured: 'true' }
          }
        ]
      }
    ];

    if (this.isLoggedIn()) {
      if (this.userType() === 'seller') {
        baseItems.push({
          label: 'Panel vendedor',
          icon: 'pi pi-briefcase',
          items: [
            {
              label: 'Resumen',
              icon: 'pi pi-chart-line',
              routerLink: '/dashboard'
            },
            {
              label: 'Mis servicios',
              icon: 'pi pi-list',
              routerLink: '/my-services'
            },
            {
              label: 'Crear servicio',
              icon: 'pi pi-plus',
              routerLink: '/my-services/create'
            },
            {
              separator: true
            },
            {
              label: 'Mi perfil de vendedor',
              icon: 'pi pi-user',
              routerLink: '/profile'
            }
          ]
        });
      } else if (this.userType() === 'admin') {
        baseItems.push({
          label: 'Moderación',
          icon: 'pi pi-shield',
          items: [
            {
              label: 'Reportes',
              icon: 'pi pi-flag',
              routerLink: '/admin/reports'
            },
            {
              label: 'Vendedores reportados',
              icon: 'pi pi-users',
              routerLink: '/admin/reported-sellers'
            },
            {
              label: 'Publicaciones pendientes',
              icon: 'pi pi-eye',
              routerLink: '/admin/moderations'
            }
          ]
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
            routerLink: '/profile'
          },
          {
            label: 'Editar perfil',
            icon: 'pi pi-user-edit',
            routerLink: '/profile/edit'
          },
          {
            label: 'Eliminar cuenta',
            icon: 'pi pi-user-minus',
            routerLink: '/perfil/delete'
          },
          {
            separator: true
          },
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      });
    }

    this.items = [...baseItems];
  }

  private checkAuthenticationStatus() {
    // Falta implementar la lógica real de autenticación

    // Se puede descomentar las lineas de abajo para simular distintos estados

    // Simular usuario vendedor logueado
    // this.isLoggedIn.set(true);
    // this.userType.set('seller');

    // Simular admin logueado
    // this.isLoggedIn.set(true);
    // this.userType.set('admin');

    // Estado por defecto: no logueado
    this.isLoggedIn.set(false);
    this.userType.set(null);
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  logout() {
    // Falta implementar logout real
    this.isLoggedIn.set(false);
    this.userType.set(null);
    this.setupMenuItems(); // Actualizar menú después del logout
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
