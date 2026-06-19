import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { PacientesComponent } from './components/pacientes/pacientes';
import { MedicosComponent } from './components/medicos/medicos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'medicos', component: MedicosComponent },
];
