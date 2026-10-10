import { computed, inject, Injectable, signal } from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import { RitualHttp } from './ritual-http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class RitualHelper {
  private service = inject(RitualHttp);
  private router = inject(Router);
  private todaysResource = rxResource({
    stream:()=> this.service.todayRitual()
  })
  private ritualStreakResource = rxResource({
    stream: ()=> this.service.getRitualStreak()
  })
  protected today = signal(new Date().toISOString().split('T')[0])
  private getRitualByDateResource = rxResource({
    params:() => this.today(),
    stream: ({params}) => this.service.getRitualByDate(params)
  })

  public ritualStreak = computed(()=>
    this.ritualStreakResource.isLoading() || this.ritualStreakResource.error() ?  null:
    this.ritualStreakResource.value() )
  
  public showTodaysRitual = computed(()=> 
    this.todaysResource.isLoading() || this.todaysResource.error() ? false :
    this.todaysResource.value() )
  
  public getRitualByDate = computed(()=> 
    this.getRitualByDateResource.isLoading() || this.getRitualByDateResource.error() ? null :
    this.getRitualByDateResource.value() )
  
  
  // La Signal inicia evaluando la realidad inmediatamente
  public ritualCompletadoHoy = signal<boolean>(this.evaluarSiEsHoy());

  // 1. Evalúa si la última victoria corresponde al día de hoy
  private evaluarSiEsHoy(): boolean {
    const lastDate = localStorage.getItem('last_ritual_date');
    if (!lastDate) return false;

    // Formato local YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA'); 
    return lastDate === today;
  }

  // 2. Registra la victoria con un sello de tiempo irrefutable
  setRitualCompletado() {
    const today = new Date().toLocaleDateString('en-CA');
    localStorage.setItem('last_ritual_date', today);
    this.ritualCompletadoHoy.set(true);
  }

  // 3. Verifica activamente si el día ha expirado y expulsa al usuario si es así
  verificarExpiracion() {
    if (!this.evaluarSiEsHoy() && this.ritualCompletadoHoy()) {
      console.warn('Nuevo día detectado. Reseteando sistema de disciplina.');
      this.ritualCompletadoHoy.set(false);
      localStorage.removeItem('last_ritual_date'); // Limpia el caché obsoleto
      
      // Expulsa al usuario del Dashboard hacia la pantalla de forjar el ritual
      this.router.navigate(['/']); 
    }
  }
}
