import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/login/login';
import { authGuard } from './features/login/logic/auth-guard';

export const routes: Routes = [
    {
        path: 'home',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
