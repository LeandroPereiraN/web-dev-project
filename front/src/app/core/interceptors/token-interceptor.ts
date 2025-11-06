import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MainStore } from '../../shared/stores/main.store';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const mainStore = inject(MainStore)

  if (!mainStore.token()) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${mainStore.token()}`
    }
  })

  return next(authReq);
};
