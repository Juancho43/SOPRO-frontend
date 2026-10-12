import { computed, inject, Injectable } from '@angular/core';
import { FocusmateHTTP } from './focusmate-http';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FocumateHelper {
  private http = inject(FocusmateHTTP);
  
  futureResource = rxResource({
    stream: () => this.http.futureSessions(),
  });
  futureSessions = computed(() => this.futureResource.value() || []);

}
