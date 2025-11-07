import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenuBarComponent } from './shared/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent, CommonModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Servicios App');
}
