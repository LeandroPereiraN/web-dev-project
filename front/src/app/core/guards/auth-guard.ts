import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MainStore } from '../../shared/stores/main.store';

function notifyAndRedirect(
  redirect: string,
  summary: string,
  detail: string,
  severity: 'info' | 'warn' | 'error' = 'warn'
): UrlTree {
  const router = inject(Router);
  const messageService = inject(MessageService);

  messageService.add({ severity, summary, detail, life: 3500 });
  return router.createUrlTree([redirect]);
}

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const mainStore = inject(MainStore);

  if (!mainStore.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return true;
};

export const sellerGuard: CanActivateFn = (route, state) => {
  const authResult = authGuard(route, state);
  if (authResult !== true) {
    return authResult;
  }

  const mainStore = inject(MainStore);
  if (!mainStore.isSeller()) {
    return notifyAndRedirect(
      '/home',
      'Acceso restringido',
      'Necesitas una cuenta de vendedor para acceder a esta sección.'
    );
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authResult = authGuard(route, state);
  if (authResult !== true) {
    return authResult;
  }

  const mainStore = inject(MainStore);
  if (!mainStore.isAdmin()) {
    return notifyAndRedirect(
      '/home',
      'Acceso restringido',
      'Solo el personal administrador puede ingresar a esta sección.'
    );
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const mainStore = inject(MainStore);
  if (!mainStore.isAuthenticated()) {
    return true;
  }

  const target = mainStore.isAdmin()
    ? '/admin/reports'
    : mainStore.isSeller()
      ? '/dashboard'
      : '/home';

  return notifyAndRedirect(target, 'Sesión activa', 'Ya iniciaste sesión.', 'info');
};
