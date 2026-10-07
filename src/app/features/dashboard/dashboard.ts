import { Component, computed, inject, signal } from '@angular/core';
import { RitualForm } from '../rituals/ritual-form/ritual-form';
import { Navbar } from '../../core/navbar/navbar';
import { StreakCard } from '../streak/streak-card/streak-card';
import { RitualHelper } from '../rituals/logic/ritual-helper';

@Component({
  selector: 'app-dashboard',
  imports: [RitualForm, Navbar, StreakCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  
  private ritualHelper = inject(RitualHelper);
  protected showRitual = computed(()=>this.ritualHelper.todaysRitual())
  protected ritualStreak = computed(()=> this.ritualHelper.ritualStreak())
}
