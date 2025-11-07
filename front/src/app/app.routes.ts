import { Routes } from '@angular/router';

import { ListServicesPages } from './routes/pages/servicesProducts/list-services/list-services.pages';
import { ContactServicesPages } from './routes/pages/servicesProducts/contact-services/contact-services.pages';
import { DetailServicesPages } from './routes/pages/servicesProducts/detail-services/detail-services.pages';
import { ReportsPages } from './routes/pages/admin/reports/reports.pages';
import { ReportedSellersPages } from './routes/pages/admin/reported-sellers/reported-sellers.pages';
import { ModerationPages } from './routes/pages/admin/moderation/moderation.pages';
import { CreateServicesPages } from './routes/pages/servicesProducts/create-services/create-services.pages';
import { EditServicesPages } from './routes/pages/servicesProducts/edit-services/edit-services.pages';
import { HomePage } from './routes/pages/home/home.page';
import { DashboardPage } from './routes/pages/dashboard/dashboard.page';
import { LoginPages } from './routes/pages/auth/login/login.pages';
import { RegisterPages } from './routes/pages/auth/register/register.pages';
import { EditProfilePage } from './routes/pages/profile/edit-profile/edit-profile.page';
import { DeleteAccountPage } from './routes/pages/profile/delete-account/delete-account.page';
import { ProfilePage } from './routes/pages/profile/profile/profile.page';
import { adminGuard, authGuard, guestGuard, sellerGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage, title: 'home' },
  { path: 'login', component: LoginPages, title: 'login', canActivate: [guestGuard] },
  { path: 'register', component: RegisterPages, title: 'register', canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardPage, title: 'dashboard', canActivate: [sellerGuard] },
  {
    path: 'profile',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: ProfilePage, title: 'pagina de perfil' },
      { path: 'edit', component: EditProfilePage, title: 'editar perfil' },
      { path: 'delete', component: DeleteAccountPage, title: 'eliminar cuenta' },
    ],
  },

  {
    path: 'services',
    children: [
      { path: '', component: ListServicesPages, title: 'lista de servicios en publico' },
      { path: ':id', component: DetailServicesPages, title: 'detalles del producto' },
      { path: ':id/contact', component: ContactServicesPages, title: 'contactar al vendedor' },
    ],
  },

  {
    path: 'my-services',
    canActivate: [sellerGuard],
    canActivateChild: [sellerGuard],
    children: [
      { path: '', component: DashboardPage, title: 'servicios' },
      { path: 'create', component: CreateServicesPages, title: 'crear servicios' },
      { path: ':id/edit', component: EditServicesPages, title: 'editar mis servicios' },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [
      { path: 'reports', component: ReportsPages },
      { path: 'reported-sellers', component: ReportedSellersPages },
      { path: 'moderations', component: ModerationPages },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
