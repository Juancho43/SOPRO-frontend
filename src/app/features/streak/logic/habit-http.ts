import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Habit, HabitWithStreak, HabitCheckInResult } from './Habit';

@Injectable({
  providedIn: 'root',
})
export class HabitHTTP {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/habits`;

  createHabit(command: Partial<Habit>): Observable<Habit> {
    const freq = command.frequency || 'daily';
    const defaultTarget = freq === 'weekdays' ? 5 : (freq === 'weekly' ? 3 : 7);
    const payload = {
      name: command.name,
      frequency: freq,
      weekly_target: command.weeklyTarget || command.weekly_target || defaultTarget,
      domain_id: command.domainId || command.domain_id || null,
    };
    return this.http.post<Habit>(this.apiUrl, payload);
  }

  updateHabit(id: string, command: Partial<Habit>): Observable<Habit> {
    const freq = command.frequency || 'daily';
    const defaultTarget = freq === 'weekdays' ? 5 : (freq === 'weekly' ? 3 : 7);
    const payload = {
      name: command.name,
      frequency: freq,
      weekly_target: command.weeklyTarget || command.weekly_target || defaultTarget,
      domain_id: command.domainId || command.domain_id || null,
    };
    return this.http.put<Habit>(`${this.apiUrl}/${id}`, payload);
  }

  deleteHabit(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  listHabits(): Observable<HabitWithStreak[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((items) =>
        (items || []).map((h) => {
          const freq = h.frequency || 'daily';
          const target = Number(h.weekly_target ?? h.weeklyTarget ?? (freq === 'weekdays' ? 5 : 7));
          return {
            ...h,
            frequency: freq,
            weeklyTarget: target,
            weekly_target: target,
            domainId: h.domain_id ?? h.domainId,
            domainName: h.domain_name ?? h.domainName,
            domainColor: h.domain_color ?? h.domainColor,
            currentStreak: Number(h.current_streak ?? h.currentStreak ?? 0),
            current_streak: Number(h.current_streak ?? h.currentStreak ?? 0),
            maxStreak: Number(h.max_streak ?? h.maxStreak ?? 0),
            max_streak: Number(h.max_streak ?? h.maxStreak ?? 0),
            completedToday: Boolean(h.completed_today ?? h.completedToday ?? false),
            completed_today: Boolean(h.completed_today ?? h.completedToday ?? false),
          };
        })
      )
    );
  }

  checkInHabit(id: string): Observable<HabitCheckInResult> {
    return this.http.post<any>(`${this.apiUrl}/${id}/check-in`, {}).pipe(
      map((res) => {
        const streak = Number(res.current_streak ?? res.currentStreak ?? res.newStreak ?? 0);
        return {
          ...res,
          newStreak: streak,
          currentStreak: streak,
          current_streak: streak,
          maxStreak: Number(res.max_streak ?? res.maxStreak ?? 0),
          max_streak: Number(res.max_streak ?? res.maxStreak ?? 0),
        };
      })
    );
  }

  getHabitHistory(id: string): Observable<string[]> {
    // Retorna array de fechas ISO YYYY-MM-DD
    return this.http.get<string[]>(`${this.apiUrl}/${id}/history`);
  }
}
