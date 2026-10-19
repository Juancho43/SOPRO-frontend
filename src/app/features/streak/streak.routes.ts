import { Routes } from '@angular/router';
import { View } from './view/view';

export const STREAKS_ROUTES: Routes = [
  {
    path: '',
    component: View,
    children: [
      {
        // Redirección por defecto al entrar a /streaks
        path: '',
        redirectTo: 'habits',
        pathMatch: 'full'
      },
      {
        path: 'habits',
        loadComponent: () => 
          import('./habits-view/habits-view').then(m => m.HabitsView),
        title: 'SOP - Hábitos'
      },
      {
        path: 'domains',
        loadComponent: () => 
          import('./domains-view/domains-view').then(m => m.DomainsView),
        title: 'SOP - Dominios'
      },
      {
        path: 'trophies',
        loadComponent: () => 
          import('./trophies-view/trophies-view').then(m => m.TrophiesView),
        title: 'SOP - Vitrina de Trofeos'
      },
      {
        path: 'compound-trophies',
        loadComponent: () => 
          import('./compound-trophies-view/compound-trophies-view').then(m => m.CompoundTrophiesView),
        title: 'SOP - Trofeos de Sinergia'
      }
    ]
  }
];