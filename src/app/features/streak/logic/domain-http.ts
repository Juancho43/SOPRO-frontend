import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Domain, DomainWithHabitCount, DomainEffortPoint } from './Domain';

@Injectable({
  providedIn: 'root',
})
export class DomainHTTP {
private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/domains`;

  createDomain(command: Partial<Domain>): Observable<Domain> {
    return this.http.post<Domain>(this.apiUrl, command);
  }

  listDomains(): Observable<DomainWithHabitCount[]> {
    return this.http.get<DomainWithHabitCount[]>(this.apiUrl);
  }

  updateDomain(id: string, command: Partial<Domain>): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.apiUrl}/${id}`, command);
  }

  deleteDomain(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`);
  }

  getRadarMetrics(): Observable<DomainEffortPoint[]> {
    return this.http.get<DomainEffortPoint[]>(`${this.apiUrl}/radar`);
  }
}
