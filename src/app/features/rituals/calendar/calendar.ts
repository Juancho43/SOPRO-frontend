

import { Component, inject, signal, effect, computed } from '@angular/core';
import { RitualHttp } from '../logic/ritual-http';
import { DailyRitual } from '../logic/DailyRitual';
import { CalendarInput } from '../calendar-input/calendar-input';
import { RitualAccordion } from '../ritual-accordion/ritual-accordion';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarInput, RitualAccordion],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class CalendarComponent {
  private service = inject(RitualHttp);
  
  // Inicializamos con la fecha de hoy en formato YYYY-MM-DD
  public selectedDate = signal<string>(this.getTodayISO());
  public historicalRitual = computed(() => this.getRitualByDate())
    public isLoading = signal<boolean>(false);
  private getRitualByDateResource = rxResource({
    params:() => this.selectedDate(),
    stream: ({params}) => this.service.getRitualByDate(params)
  })
  public getRitualByDate = computed(()=> 
    this.getRitualByDateResource.isLoading() || this.getRitualByDateResource.error() ? null :
    this.getRitualByDateResource.value() )
 
public today = signal(new Date().toISOString().split('T')[0]);

  constructor() {
    // El motor reactivo: Cada vez que 'selectedDate' cambie, se ejecuta esto
    effect(() => {
      const dateTarget = this.selectedDate();
      this.fetchHistoricalRitual(dateTarget);
    });
  }

  private getTodayISO(): string {
    const today = new Date();
    // Ajuste de zona horaria local para evitar que devuelva el día anterior por UTC
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split('T')[0];
  }

  private async fetchHistoricalRitual(dateStr: string) {
    if (!dateStr) return;
    
    this.isLoading.set(true);
    try {
      // AQUÍ DEBES ASEGURARTE de que tu backend tenga un endpoint que reciba la fecha
      // ej: /api/rituals?date=2026-10-14
      // const ritual = await this.ritualHttp.getRitualByDate(dateStr);
      // this.historicalRitual.set(ritual);
      
      // Simulador visual temporal (Bórralo al conectar tu API)
      setTimeout(() => this.isLoading.set(false), 500);
      
    } catch (error) {
      // this.historicalRitual.set(null);
      this.isLoading.set(false);
    }
  }
}
