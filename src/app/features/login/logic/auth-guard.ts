import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelper } from './auth-helper';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthHelper); 
  
  if (authService.isLoggedIn()) {
    return true; 
  } else {
    router.navigate(['/login']);
    return false;
  }
};