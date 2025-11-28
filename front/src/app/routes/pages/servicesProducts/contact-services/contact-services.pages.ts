import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CatalogService } from '../../../../shared/services/catalog.service';
import type { ServiceItem } from '../../../../shared/types/service';
import { UyuCurrencyPipe } from '../../../../shared/pipes/uyu-currency.pipe';
import { PHONE_REGEX } from '../../../../shared/utils/validation';
import { MainStore } from '../../../../shared/stores/main.store';

interface ContactForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  taskDescription: FormControl<string>;
}

@Component({
  selector: 'app-contact-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    UyuCurrencyPipe,
  ],
  templateUrl: './contact-services.pages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactServicesPages {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  
  readonly mainStore = inject(MainStore);
  readonly loadingService = signal(true);
  readonly submitting = signal(false);
  readonly service = signal<ServiceItem | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly contactForm: FormGroup<ContactForm> = this.fb.group({
    firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    lastName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    phone: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(PHONE_REGEX)]),
    taskDescription: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(20),
    ]),
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const idParam = params.get('id');
      const serviceId = Number(idParam);

      if (!serviceId || Number.isNaN(serviceId)) {
        this.handleError('El servicio que intentas contactar no existe.');
        return;
      }

      this.loadService(serviceId);
    });
  }

  async submit(): Promise<void> {
    if (this.contactForm.invalid || this.submitting()) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const currentService = this.service();
    if (!currentService) {
      this.handleError('No pudimos identificar el servicio. Intenta más tarde.');
      return;
    }

    this.submitting.set(true);

    try {
      const payload = this.contactForm.getRawValue();
      await this.catalogService.contactSeller(currentService.id, {
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        taskDescription: payload.taskDescription.trim(),
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Solicitud enviada',
        detail: 'El proveedor recibió tu consulta y se comunicará contigo a la brevedad.',
        life: 3500,
      });

      this.contactForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        taskDescription: '',
      });

      await this.router.navigate(['/services', currentService.id]);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos enviar tu consulta',
        detail: 'Intenta nuevamente en unos minutos.',
        life: 3500,
      });
    } finally {
      this.submitting.set(false);
    }
  }

  private async loadService(serviceId: number): Promise<void> {
    try {
      this.loadingService.set(true);
      this.errorMessage.set(null);

      const service = await this.catalogService.getService(serviceId);
      this.service.set(service);
    } catch {
      this.handleError('No pudimos obtener la información del servicio que quieres contactar.');
    } finally {
      this.loadingService.set(false);
    }
  }

  private handleError(message: string): void {
    this.errorMessage.set(message);
    this.service.set(null);
    this.messageService.add({
      severity: 'error',
      summary: 'Servicio no disponible',
      detail: message,
      life: 4000,
    });
  }
}
