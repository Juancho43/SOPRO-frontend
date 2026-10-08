import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RitualHelper } from '../../rituals/logic/ritual-helper';


interface DayStatus {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
}
@Component({
  selector: 'app-streak-celebration',
  imports: [RouterLink],
  templateUrl: './streak-celebration.html',
  styleUrl: './streak-celebration.scss',
})
export class StreakCelebration {
  private ritualHelper = inject(RitualHelper);
  protected ritualStreak = computed(()=> this.ritualHelper.ritualStreak())
  protected streakCount = computed(()=> this.ritualStreak()?.CurrentStreak)

}
