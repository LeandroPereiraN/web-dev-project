import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MainStore } from '../../shared/stores/main.store';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const mainStore = inject(MainStore)
  const router = inject(Router) 

  if (!mainStore.token()) {
    return router.createUrlTree(["/login"])
  }

  return true;
};
