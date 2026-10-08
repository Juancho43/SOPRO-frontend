import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/login/login';
import { authGuard } from './features/login/logic/auth-guard';
import { StreakCelebration } from './features/streak/streak-celebration/streak-celebration';
import { GuestGuard } from './features/login/logic/guest-guard';

export const routes: Routes = [
    {
        path: 'home',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path:'streak',
        component: StreakCelebration,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login,
        canActivate: [GuestGuard]
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];
