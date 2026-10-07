import { computed, inject, Injectable } from '@angular/core';
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

  public ritualStreak = computed(()=>
    this.ritualStreakResource.isLoading() || this.ritualStreakResource.error() ?  null:
    this.ritualStreakResource.value() )
  
  public todaysRitual = computed(()=> 
    this.todaysResource.isLoading() || this.todaysResource.error() ? false :
    this.todaysResource.value() )
}
