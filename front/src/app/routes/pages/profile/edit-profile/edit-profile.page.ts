import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../shared/services/user.service';
import { MainStore } from '../../../../shared/stores/main.store';
import type { UserProfile } from '../../../../shared/types/user';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    PasswordModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-profile.page.html',
  styleUrl: './edit-profile.page.css',
})
export class EditProfilePage {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private mainStore = inject(MainStore);

  profileForm = this.fb.group({
    firstName: this.fb.nonNullable.control('', Validators.required),
    lastName: this.fb.nonNullable.control('', Validators.required),
    phone: this.fb.nonNullable.control(''),
    address: this.fb.nonNullable.control(''),
    specialty: this.fb.nonNullable.control(''),
    yearsExperience: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    professionalDescription: this.fb.nonNullable.control(''),
    profilePictureUrl: this.fb.nonNullable.control(''),
  });

  passwordForm = this.fb.group({
    currentPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    newPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
  });

  loadingProfile = signal(true);
  updatingProfile = signal(false);
  updatingPassword = signal(false);

  private profile: UserProfile | null = null;

  constructor() {
    this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      this.loadingProfile.set(true);
      const profile = await this.userService.getCurrentProfile();
      this.profile = profile;

      this.profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? '',
        address: profile.address ?? '',
        specialty: profile.specialty ?? '',
        yearsExperience: profile.yearsExperience ?? null,
        professionalDescription: profile.professionalDescription ?? '',
        profilePictureUrl: profile.profilePictureUrl ?? '',
      });
    } catch (error: any) {
      const detail = error?.error?.message ?? 'No pudimos cargar tu perfil.';
      this.messageService.add({ severity: 'error', summary: 'Error al cargar perfil', detail });
      await this.router.navigate(['/profile']);
    } finally {
      this.loadingProfile.set(false);
    }
  }

  async onSaveProfile(): Promise<void> {
    if (this.profileForm.invalid || !this.profile || this.updatingProfile()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.updatingProfile.set(true);

    try {
      const user = this.mainStore.user();
      if (!user) {
        throw new Error('Sesión no disponible');
      }

      const {
        firstName,
        lastName,
        phone,
        address,
        specialty,
        yearsExperience,
        professionalDescription,
        profilePictureUrl,
      } = this.profileForm.getRawValue();

      const updated = await this.userService.updateProfile(user.id, {
        firstName,
        lastName,
        phone: phone.trim() ? phone : null,
        address: address.trim() ? address : null,
        specialty: specialty.trim() ? specialty : null,
        yearsExperience: yearsExperience ?? null,
        professionalDescription: professionalDescription.trim() ? professionalDescription : null,
        profilePictureUrl: profilePictureUrl.trim() ? profilePictureUrl : null,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Perfil actualizado',
        detail: 'Los cambios se guardaron correctamente.',
        life: 3000,
      });

      this.profile = updated;
    } catch (error: any) {
      const detail = error?.error?.message ?? 'No se pudo actualizar el perfil.';
      this.messageService.add({ severity: 'error', summary: 'Error al guardar', detail });
    } finally {
      this.updatingProfile.set(false);
    }
  }

  async onChangePassword(): Promise<void> {
    if (this.passwordForm.invalid || this.updatingPassword()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Las contraseñas nuevas deben coincidir.',
      });
      return;
    }

    this.updatingPassword.set(true);

    try {
      const user = this.mainStore.user();
      if (!user) {
        throw new Error('Sesión no disponible');
      }

      const { currentPassword } = this.passwordForm.getRawValue();
      await this.userService.changePassword(user.id, {
        currentPassword,
        newPassword,
      });
      
      this.messageService.add({
        severity: 'success',
        summary: 'Contraseña actualizada',
        detail: 'Tu contraseña se actualizó correctamente.',
      });

      this.passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      const detail = error?.error?.message ?? 'No se pudo cambiar la contraseña.';
      this.messageService.add({ severity: 'error', summary: 'Error al cambiar', detail });
    } finally {
      this.updatingPassword.set(false);
    }
  }

}
