import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelper } from './auth-helper';

export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthHelper);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/home']);
    return false; 
  }
  return true;
};
