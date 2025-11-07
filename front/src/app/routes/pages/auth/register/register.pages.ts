import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.pages.html',
  styleUrl: './register.pages.css',
})
export class RegisterPages {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: [''],
    specialty: [''],
    yearsExperience: [null, [Validators.min(0)]],
    professionalDescription: [''],
    profilePictureUrl: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: [RegisterPages.passwordsMatchValidator] });

  loading = signal(false);
  submitDisabled = computed(() => this.loading() || this.form.invalid);

  static passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsNotMatching: true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        address,
        specialty,
        yearsExperience,
        professionalDescription,
        profilePictureUrl,
        password,
        confirmPassword,
      } = this.form.getRawValue();

      await this.authService.register({
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: email ?? '',
        phone: phone ?? '',
        address: address ?? undefined,
        specialty: specialty ?? undefined,
        yearsExperience: yearsExperience ?? undefined,
        professionalDescription: professionalDescription ?? undefined,
        profilePictureUrl: profilePictureUrl ?? undefined,
        password: password ?? '',
        confirmPassword: confirmPassword ?? '',
      });
      
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.',
        life: 3500,
      });
      this.form.reset();
      await this.router.navigate(['/login']);
    } catch (error: any) {
      const detail = error?.error?.message ?? 'No pudimos crear tu cuenta, intenta nuevamente.';
      this.messageService.add({ severity: 'error', summary: 'Error al registrar', detail, life: 4000 });
    } finally {
      this.loading.set(false);
    }
  }

}
