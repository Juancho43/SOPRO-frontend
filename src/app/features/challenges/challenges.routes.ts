import { Routes } from '@angular/router';

export const CHALLENGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./view/challenges-view.component').then((m) => m.ChallengesViewComponent),
    title: 'SOP - Retos y Sprints',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./challenge-detail/challenge-detail.component').then(
        (m) => m.ChallengeDetailComponent
      ),
    title: 'SOP - Detalle del Reto',
  },
];
