import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenuBarComponent } from './shared/components/menu-bar/menu-bar.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { AppFooterComponent } from './shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent, CommonModule, ToastModule, LoadingOverlayComponent, AppFooterComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Servicios App');
}
