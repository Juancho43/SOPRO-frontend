import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthHelper } from './auth-helper';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authHelper = inject(AuthHelper);
  const token = authHelper.getToken();

  // Si la petición ya incluye un header de Authorization explícito o no hay token, continuar
  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
