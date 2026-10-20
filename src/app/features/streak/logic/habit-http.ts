import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Habit, HabitWithStreak, HabitCheckInResult } from './Habit';

@Injectable({
  providedIn: 'root',
})
export class HabitHTTP {
private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/habits`;

  createHabit(command: Partial<Habit>): Observable<Habit> {
    return this.http.post<Habit>(this.apiUrl, command);
  }

  listHabits(): Observable<HabitWithStreak[]> {
    return this.http.get<HabitWithStreak[]>(this.apiUrl);
  }

  checkInHabit(id: string): Observable<HabitCheckInResult> {
    return this.http.post<HabitCheckInResult>(`${this.apiUrl}/${id}/check-in`, {});
  }

  getHabitHistory(id: string): Observable<string[]> {
    // Retorna array de fechas ISO YYYY-MM-DD
    return this.http.get<string[]>(`${this.apiUrl}/${id}/history`);
  }
}
