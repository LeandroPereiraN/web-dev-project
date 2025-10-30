import { Routes } from '@angular/router';
import { HomePage } from './routes/home/home.page';
import { DashboardPage } from './routes/dashboard/dashboard.page';
import { LoginPage } from './routes/login/login/login.page';
import { RegisterPage } from './routes/register/register/register.page';
import { DeleteAccountPage } from './routes/profile/delete-account/delete-account.page';
import { EditProfilePage } from './routes/profile/edit-profile/edit-profile.page';
import { ProfilePage } from './routes/profile/profile/profile.page';
import { MyServicePage } from './routes/services-routes/my-service/my-service.page';
import { CreateServicePage } from './routes/services-routes/create-service/create-service.page';
import { EditServicePage } from './routes/services-routes/edit-service/edit-service.page';
import { DetailServicePage } from './routes/services-routes/detail-service/detail-service.page';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage, title: 'home' },
  { path: 'dashboard', component: DashboardPage, title: 'dashboard' },
  { path: 'login', component: LoginPage, title: 'login' }, //ruta no funciona
  { path: 'register', component: RegisterPage, title: 'register' }, //funciona la ruta
  { path: 'profile', component: ProfilePage, title: 'perfil' }, //funciona la ruta
  { path: 'profile/edit', component: EditProfilePage, title: 'editar perfil' }, //funciona la ruta
  { path: 'perfil/delete', component: DeleteAccountPage, title: 'eliminar cuenta' }, //ruta no funciona
  { path: 'services/my-services', component: MyServicePage, title: 'Mis servicios' },
  {
    path: 'services/my-services/edit/:serviceId',
    component: EditServicePage,
    title: 'Editar servicio',
  },
  { path: 'services/create', component: CreateServicePage, title: 'Crear servicio' },
  {
    path: 'services/my-services/detail/:serviceId',
    component: DetailServicePage,
    title: 'Detalles del servicio',
  },
  { path: '**', redirectTo: 'home' },
];
