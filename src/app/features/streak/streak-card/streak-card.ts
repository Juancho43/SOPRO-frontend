import { Component, input } from '@angular/core';

@Component({
  selector: 'app-streak-card',
  imports: [],
  templateUrl: './streak-card.html',
  styleUrl: './streak-card.scss',
})
export class StreakCard {

  streakValue = input<number>(366);
  streakLabel = input<string>('day streak');
}
