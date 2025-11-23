import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenuBarComponent } from './shared/components/menu-bar/menu-bar.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { AppFooterComponent } from './shared/components/app-footer/app-footer.component';
import { WsService } from './shared/services/ws.service';
import { MainStore } from './shared/stores/main.store';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuBarComponent,
    CommonModule,
    ToastModule,
    LoadingOverlayComponent,
    AppFooterComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Servicios App');

  private wsService = inject(WsService);
  private mainStore = inject(MainStore);

  private wsEffect = effect(() => {
    this.wsService.disconnect();

    this.wsService.connect(
      this.mainStore.user()?.id ?? undefined
    );
  });
}
