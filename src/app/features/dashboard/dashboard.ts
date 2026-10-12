import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from '../../core/navbar/navbar';
import { StreakCard } from '../streak/streak-card/streak-card';
import { RitualHelper } from '../rituals/logic/ritual-helper';
import { RitualAccordion } from '../rituals/ritual-accordion/ritual-accordion';
import { SessionsAccordion } from '../focusmate/sessions-accordion/sessions-accordion';
import { FocumateHelper } from '../focusmate/logic/focumate-helper';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar,RouterLink, StreakCard, RitualAccordion, SessionsAccordion],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements AfterViewInit {

  private router = inject(Router);
  private ritualHelper = inject(RitualHelper);
  private focusmate = inject(FocumateHelper);
  protected ritualStreak = computed(()=> this.ritualHelper.ritualStreak())
  protected focusmateSessions = computed(()=> this.focusmate.futureSessions())
  protected showTodaysRitual = computed(()=> this.ritualHelper.showTodaysRitual())
  protected todayRitual = computed(()=> this.ritualHelper.getRitualByDate())

    ngAfterViewInit(): void {
   if (this.showTodaysRitual() == false) {
     this.router.navigate(['/ritual-form']);
   }
  } 

}
  