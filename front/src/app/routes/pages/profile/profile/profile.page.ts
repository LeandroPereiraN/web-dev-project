import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../shared/services/user.service';
import type { UserProfile } from '../../../../shared/types/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
})
export class ProfilePage {
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  loading = signal(true);
  profile = signal<UserProfile | null>(null);

  constructor() {
    this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      this.loading.set(true);
      const profile = await this.userService.getCurrentProfile();
      this.profile.set(profile);
    } catch (error: any) {
      const detail = error?.error?.message ?? 'No pudimos obtener tu perfil.';
      this.messageService.add({ severity: 'error', summary: 'Error al cargar perfil', detail });
      await this.router.navigate(['/home']);
    } finally {
      this.loading.set(false);
    }
  }
}
