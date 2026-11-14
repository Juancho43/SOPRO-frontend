import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Domain, DomainWithHabitCount, DomainEffortPoint } from './Domain';

@Injectable({
  providedIn: 'root',
})
export class DomainHTTP {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/domains`;

  createDomain(command: Partial<Domain>): Observable<Domain> {
    const payload = {
      name: command.name,
      color: command.colorHex || command.color || '#4759A8',
    };
    return this.http.post<Domain>(this.apiUrl, payload);
  }

  listDomains(): Observable<DomainWithHabitCount[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((items) =>
        (items || []).map((d) => ({
          ...d,
          colorHex: d.color || d.colorHex || '#4759A8',
          userId: d.user_id || d.userId,
          habitCount: Number(d.habit_count ?? d.habitCount ?? 0),
        }))
      )
    );
  }

  updateDomain(id: string, command: Partial<Domain>): Observable<{ message: string }> {
    const payload = {
      name: command.name,
      color: command.colorHex || command.color || '#4759A8',
    };
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteDomain(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getRadarMetrics(): Observable<DomainEffortPoint[]> {
    return this.http.get<any[]>(`${this.apiUrl}/radar`).pipe(
      map((items) =>
        (items || []).map((m) => {
          const score = Number(m.effort_score ?? m.effortScore ?? m.effortValue ?? 0);
          return {
            ...m,
            domainId: m.domain_id || m.domainId,
            domainName: m.domain_name || m.domainName,
            color: m.color,
            completedCount: Number(m.completed_count ?? m.completedCount ?? 0),
            effortScore: score,
            effortValue: score,
          };
        })
      )
    );
  }
}
