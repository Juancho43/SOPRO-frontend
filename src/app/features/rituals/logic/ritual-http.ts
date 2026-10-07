import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, computed } from '@angular/core';
import { DailyRitual } from '../ritual-form/ritual-form';
import { environment } from '../../../../environments/environment';
import { AuthHelper } from '../../login/logic/auth-helper';
import { HabitStreak } from '../../streak/HabitStreak';

@Injectable({
  providedIn: 'root',
})
export class RitualHttp {
  private http = inject(HttpClient)
  private helper = inject(AuthHelper);
  private token = computed(()=>this.helper.getToken())
  saveRitual(ritual :DailyRitual){
    const id = this.helper.getUserId();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()!}`,
      'Content-Type': 'application/json'
    });
    ritual.User_id = id!
    return this.http.post(`${environment.apiUrl}/rituals`, ritual, {headers})
  }
  todayRitual(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()!}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<boolean>(`${environment.apiUrl}/rituals/today`,{headers})
  }
  getRitualStreak(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()!}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<HabitStreak>(`${environment.apiUrl}/streaks/habit/Ritual Diario`,{headers})
  }
}
