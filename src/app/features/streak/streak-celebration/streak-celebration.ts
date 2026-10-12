import { Component, computed, inject } from '@angular/core';
import { RitualHelper } from '../../rituals/logic/ritual-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-streak-celebration',
  imports: [],
  templateUrl: './streak-celebration.html',
  styleUrl: './streak-celebration.scss',
})
export class StreakCelebration {
  private ritualHelper = inject(RitualHelper);
  private router = inject(Router);
  protected ritualStreak = computed(()=> this.ritualHelper.ritualStreak())
  protected streakCount = computed(()=> this.ritualStreak()?.CurrentStreak! + 1)

  onContinueClicked() {
    this.ritualHelper.onNewRitualSubmmited();
    this.router.navigate(['/home']);
  }
}
