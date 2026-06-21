import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { PacientesComponent } from './components/pacientes/pacientes';
import { MedicosComponent } from './components/medicos/medicos';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { MedicoDashboardComponent } from './components/medico-dashboard/medico-dashboard';
import { EspecialidadesComponent } from './components/especialidades/especialidades';
import { authGuard } from './guards/auth.guard';
import { adminGuard, medicoGuard } from './guards/role.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'especialidades', component: EspecialidadesComponent },
  { path: 'admin',component: AdminDashboardComponent, canActivate: [authGuard,adminGuard]},
  { path: 'medico', component: MedicoDashboardComponent, canActivate: [authGuard, medicoGuard]},
  { path: 'pacientes', component: PacientesComponent },
  { path: 'medicos', component: MedicosComponent },
];
