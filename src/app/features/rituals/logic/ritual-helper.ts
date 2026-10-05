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

  public todaysRitual = computed(()=> 
    this.todaysResource.isLoading() || this.todaysResource.error() ? false :
    this.todaysResource.value() )
}
