import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MainStore } from '../../shared/stores/main.store';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const mainStore = inject(MainStore);
  const token = mainStore.token();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
