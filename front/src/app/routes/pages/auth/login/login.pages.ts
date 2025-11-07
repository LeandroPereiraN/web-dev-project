import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../shared/services/auth.service';
import { MainStore } from '../../../../shared/stores/main.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.pages.html',
  styleUrl: './login.pages.css',
})
export class LoginPages {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private mainStore = inject(MainStore);
  private destroyRef = inject(DestroyRef);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = signal(false);
  private formValid = signal(this.form.valid);
  private returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  submitDisabled = computed(() => this.loading() || !this.formValid());

  constructor() {
    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.formValid.set(this.form.valid));
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { email, password } = this.form.getRawValue();

    try {
      await this.authService.login(email, password);
      const user = this.mainStore.user();

      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenido',
        detail: 'Inicio de sesión exitoso.',
        life: 2500,
      });

      if (this.returnUrl) {
        await this.router.navigateByUrl(this.returnUrl);
        return;
      }

      if (user?.role === 'ADMIN') {
        await this.router.navigate(['/admin/reports']);
        return;
      }

      if (user?.role === 'SELLER') {
        await this.router.navigate(['/dashboard']);
        return;
      }

      await this.router.navigate(['/home']);
    } catch (error: any) {
      const detail = error?.error?.message ?? 'Revisa tus credenciales e intenta nuevamente.';

      this.messageService.add({
        severity: 'error',
        summary: 'No pudimos iniciar sesión',
        detail,
        life: 4000,
      });
    } finally {
      this.loading.set(false);
    }
  }
}
