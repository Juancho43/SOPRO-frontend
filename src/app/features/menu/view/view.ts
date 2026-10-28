import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  M3SplitButtonComponent,
  SplitButtonAction,
} from '../../../core/components/m3-split-button/m3-split-button.component';
import { DialogHelper } from '../../../core/helpers/dialog-helper';
import { ChallengeFormComponent } from '../../challenges/challenge-form/challenge-form.component';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, M3SplitButtonComponent],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  private router = inject(Router);
  private dialogHelper = inject(DialogHelper);

  public challengeActions: SplitButtonAction[] = [
    {
      id: 'view_all',
      label: 'Ver todos los retos',
      icon: 'format_list_bulleted',
    },
    {
      id: 'create_new',
      label: 'Crear nuevo reto',
      icon: 'add_task',
    },
    {
      id: 'active_sprints',
      label: 'Sprints activos',
      icon: 'bolt',
    },
  ];

  navigateToChallenges() {
    this.router.navigate(['/challenges']);
  }

  onSplitActionSelected(action: SplitButtonAction) {
    if (action.id === 'view_all' || action.id === 'active_sprints') {
      this.router.navigate(['/challenges']);
    } else if (action.id === 'create_new') {
      this.dialogHelper.open(ChallengeFormComponent, {
        data: { mode: 'create' },
      });
    }
  }
}
