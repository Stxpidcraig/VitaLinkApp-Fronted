
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const rol = localStorage.getItem('rol');

  if (rol === 'ROLE_ADMIN') {
    return true;
  }

  router.navigate(['/login']);

  return false;
};

export const medicoGuard: CanActivateFn = () => {

  const router = inject(Router);

  const rol = localStorage.getItem('rol');

  if (rol === 'ROLE_MEDICO') {
    return true;
  }

  router.navigate(['/login']);

  return false;
};
