import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeHelper } from '../logic/challenge-helper';
import { MilestoneItemComponent } from '../milestone-item/milestone-item.component';
import { DialogHelper } from '../../../core/helpers/dialog-helper';
import { MilestoneFormComponent } from '../milestone-form/milestone-form.component';
import { ChallengeFormComponent } from '../challenge-form/challenge-form.component';
import { Milestone } from '../logic/challenge.model';

@Component({
  selector: 'app-challenge-detail',
  standalone: true,
  imports: [CommonModule, MilestoneItemComponent],
  templateUrl: './challenge-detail.component.html',
  styleUrl: './challenge-detail.component.scss',
})
export class ChallengeDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected challengeHelper = inject(ChallengeHelper);
  private dialogHelper = inject(DialogHelper);

  public challenge = this.challengeHelper.currentChallenge;
  public milestones = this.challengeHelper.milestones;
  public progress = this.challengeHelper.currentChallengeProgress;

  public daysRemaining = computed(() => {
    const c = this.challenge();
    if (!c) return 0;
    const end = new Date(c.endDate).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.challengeHelper.selectChallenge(id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/challenges']);
  }

  openEditChallenge() {
    const current = this.challenge();
    if (!current) return;
    this.dialogHelper.open(ChallengeFormComponent, {
      data: { mode: 'edit', challenge: current },
    });
  }

  openAddMilestone() {
    const current = this.challenge();
    if (!current) return;
    this.dialogHelper.open(MilestoneFormComponent, {
      data: {
        challengeId: current.id,
        minDate: current.startDate,
        maxDate: current.endDate,
      },
    });
  }

  onToggleMilestone(milestone: Milestone) {
    const current = this.challenge();
    if (!current) return;
    this.challengeHelper.toggleMilestone(current.id, milestone).subscribe();
  }

  onDeleteMilestone(milestoneId: string) {
    const current = this.challenge();
    if (!current) return;
    this.challengeHelper.deleteMilestone(current.id, milestoneId).subscribe();
  }

  changeStatus(status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED') {
    const current = this.challenge();
    if (!current) return;
    this.challengeHelper.updateStatus(current.id, status).subscribe();
  }
}
