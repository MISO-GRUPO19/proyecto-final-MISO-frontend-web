import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const adminOnlyGuard: CanActivateFn = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const userJson = sessionStorage.getItem('user');

  if (userJson) {
    const user = JSON.parse(userJson);
    if (user.role === 1) {
      return true;
    }
  }

  toastr.error('Tu usuario no está autorizado para acceder a esta plataforma', 'Acceso denegado');

  // Si no es administrador, redirigir al login
  router.navigate(['/']);
  return false;
};
