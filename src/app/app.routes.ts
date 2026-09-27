import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/login/login';

export const routes: Routes = [
    {
        path:'home',
        component: Dashboard
    },
    {
        path:'',
        component:Login
    }
];
