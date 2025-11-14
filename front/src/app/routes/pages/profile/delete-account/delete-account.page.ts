import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../../shared/services/user.service';
import { MainStore } from '../../../../shared/stores/main.store';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PasswordModule,
    ButtonModule,
    ConfirmDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-account.page.html',
})
export class DeleteAccountPage {
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private router = inject(Router);
  private mainStore = inject(MainStore);

  form = this.fb.group({
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
  });

  loading = signal(false);

  confirmDelete(event: Event): void {
    event.preventDefault();

    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmationService.confirm({
      header: 'Eliminar cuenta',
      message: 'Esta acción es irreversible. ¿Deseas continuar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteAccount(),
    });
  }

  private async deleteAccount(): Promise<void> {
    try {
      this.loading.set(true);
      const user = this.mainStore.user();
      if (!user) {
        throw new Error('Sesión no disponible');
      }

      const { password } = this.form.getRawValue();
      await this.userService.deleteAccount(user.id, { password });

      this.messageService.add({
        severity: 'success',
        summary: 'Cuenta eliminada',
        detail: 'Tu cuenta fue eliminada correctamente.',
        life: 3500,
      });

      await this.router.navigate(['/home']);
    } catch (error: any) {
      const detail = error?.error?.message ?? 'No pudimos eliminar tu cuenta.';
      this.messageService.add({ severity: 'error', summary: 'Error al eliminar', detail });
    } finally {
      this.loading.set(false);
      this.form.reset({ password: '' });
    }
  }
}
