import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import { RitualHttp } from './ritual-http';
@Injectable({
  providedIn: 'root',
})
export class RitualHelper {
  private service = inject(RitualHttp);
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
 
    onNewRitualSubmmited(){
      this.todaysResource.reload();
      this.getRitualByDateResource.reload();
      this.ritualStreakResource.reload();
    }

}
