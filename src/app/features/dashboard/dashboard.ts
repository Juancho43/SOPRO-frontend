import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from '../../core/navbar/navbar';
import { StreakCard } from '../streak/streak-card/streak-card';
import { RitualHelper } from '../rituals/logic/ritual-helper';
import { RitualAccordion } from '../rituals/ritual-accordion/ritual-accordion';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, StreakCard, RitualAccordion],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private ritualHelper = inject(RitualHelper);
  protected ritualStreak = computed(()=> this.ritualHelper.ritualStreak())
  protected todayRitual = computed(()=> this.ritualHelper.getRitualByDate())
}
  