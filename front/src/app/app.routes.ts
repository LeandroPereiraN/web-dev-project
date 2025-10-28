import { Routes } from '@angular/router';
import { HomePage } from './routes/home/home.page';
import { DashboardPage } from './routes/dashboard/dashboard.page';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage, title: 'home' },
  { path: 'dashboard', component: DashboardPage, title: 'dashboard' },
]; //ahora mismo esta mostrando solo el home
