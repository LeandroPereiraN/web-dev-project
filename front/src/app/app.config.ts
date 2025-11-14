import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { tokenInterceptor } from './core/interceptors/token-interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { errorNotificationInterceptor } from './core/interceptors/error-notification-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptor,
        tokenInterceptor,
        authErrorInterceptor,
        errorNotificationInterceptor,
      ])
    ),
    MessageService,
    ConfirmationService,
  ],
};
