import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Trophy, ShowcaseTrophy, SynergyStatus } from './Trophy';

@Injectable({
  providedIn: 'root',
})
export class TrophyHTTP {
private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  createTrophy(command: Partial<Trophy>): Observable<Trophy> {
    return this.http.post<Trophy>(`${this.apiUrl}/trophies`, command);
  }

  listTrophies(): Observable<Trophy[]> {
    return this.http.get<Trophy[]>(`${this.apiUrl}/trophies`);
  }

  getUserShowcase(): Observable<ShowcaseTrophy[]> {
    return this.http.get<ShowcaseTrophy[]>(`${this.apiUrl}/users/me/trophies`);
  }

  getSynergyStatus(trophyId: string): Observable<SynergyStatus> {
    return this.http.get<SynergyStatus>(`${this.apiUrl}/trophies/${trophyId}/synergy-status`);
  }
}
