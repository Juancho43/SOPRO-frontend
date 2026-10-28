import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChallengeHelper } from '../logic/challenge-helper';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { DialogHelper } from '../../../core/helpers/dialog-helper';
import { ChallengeFormComponent } from '../challenge-form/challenge-form.component';

@Component({
  selector: 'app-challenges-view',
  standalone: true,
  imports: [CommonModule, ChallengeCardComponent],
  templateUrl: './challenges-view.component.html',
  styleUrl: './challenges-view.component.scss',
})
export class ChallengesViewComponent {
  private router = inject(Router);
  protected helper = inject(ChallengeHelper);
  private dialogHelper = inject(DialogHelper);

  public challenges = this.helper.challenges;
  public isLoading = this.helper.isLoadingChallenges;
  public activeFilter = this.helper.selectedStatus;

  setFilter(status: 'ACTIVE' | 'COMPLETED' | 'ALL') {
    this.helper.setFilter(status);
  }

  goToDetail(challengeId: string) {
    this.router.navigate(['/challenges', challengeId]);
  }

  openCreateModal() {
    this.dialogHelper.open(ChallengeFormComponent, {
      data: { mode: 'create' },
    });
  }
}
