import { Routes } from '@angular/router';
import { authGuard } from './features/login/logic/auth-guard';
import { GuestGuard } from './features/login/logic/guest-guard';
import { FocusLayout } from './core/focus-layout/focus-layout';
import { MainLayout } from './core/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: FocusLayout,
        children: [
            {
                path: 'login',
                canActivate: [GuestGuard],
                loadComponent: () => import('./features/login/login').then(m => m.Login)
            },
            {
                path: 'rituals/form',
                canActivate: [authGuard],
                loadComponent: () => import('./features/rituals/ritual-form/ritual-form').then(m => m.RitualForm),
            },
            {
                path: 'streaks/celebration',

                canActivate: [authGuard],
                loadComponent: () => import('./features/streak/streak-celebration/streak-celebration').then(m => m.StreakCelebration),
            }
        ],
    },

    {
        path: '',
        component: MainLayout,
        children: [

            {
                path: 'home',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
                canActivate: [authGuard]
            },
            {
                path: 'rituals',
                canActivate: [authGuard],
                loadComponent: () => import('./features/rituals/view/view').then(m => m.View),
                children: [
                    {

                        path: '',
                        loadComponent: () => import('./features/rituals/calendar/calendar').then(m => m.CalendarComponent),
                    }

                ]
            },
        {
    path: 'streaks',
    // Lazy loading del grupo de rutas completo
    loadChildren: () => 
      import('./features/streak/streak.routes').then(m => m.STREAKS_ROUTES)
  },
            {
                path: 'finances',
                canActivate: [authGuard],
                loadComponent: () => import('./features/finance/view/view').then(m => m.View)
            },
            {
                path: 'menu',
                canActivate: [authGuard],
                loadComponent: () => import('./features/menu/view/view').then(m => m.View)
            },
        ]
    },
 
    {
        path: '**',
        redirectTo: '/home'
    }
];
