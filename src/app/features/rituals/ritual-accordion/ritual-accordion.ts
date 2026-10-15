import { Component, input, linkedSignal, signal } from '@angular/core';
import { DailyRitual } from '../logic/DailyRitual';

@Component({
  selector: 'app-ritual-accordion',
  imports: [],
  templateUrl: './ritual-accordion.html',
  styleUrl: './ritual-accordion.scss',
})
export class RitualAccordion {
  ritual = input<DailyRitual>()
  expanded = input<boolean>(false)
isExpanded = linkedSignal(()=>this.expanded());

  toggle() {
    this.isExpanded.update(v => !v);
  }
}
