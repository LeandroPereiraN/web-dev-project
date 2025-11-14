import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorNotificationInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (shouldNotify(error)) {
        const detail = resolveDetail(error);
        messageService.add({
          severity: 'error',
          summary: 'Error en la operación',
          detail,
          life: 4000,
        });
      }

      return throwError(() => error);
    })
  );
};

function shouldNotify(error: HttpErrorResponse): boolean {
  if (error.status === 0) {
    return true;
  }

  if (error.status === 401 || error.status === 403) {
    return false;
  }

  return error.status >= 400;
}

function resolveDetail(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No pudimos comunicarnos con el servidor. Revisa tu conexión e intenta nuevamente.';
  }

  const apiMessage = (error.error as { message?: string } | undefined)?.message;
  if (apiMessage) {
    return apiMessage;
  }

  switch (error.status) {
    case 400:
      return 'La solicitud es inválida. Revisa los datos ingresados.';
    case 404:
      return 'No encontramos la información solicitada.';
    case 422:
      return 'Algunos datos no pasaron la validación. Corrígelos e intenta otra vez.';
    case 500:
      return 'Ocurrió un problema en el servidor. Intenta nuevamente en unos momentos.';
    default:
      return 'No pudimos completar la acción. Intenta nuevamente.';
  }
}
