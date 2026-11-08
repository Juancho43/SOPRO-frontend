import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Trophy,
  ShowcaseTrophy,
  SynergyStatus,
  TrophyListResult,
  TrophyFilterParams,
  CreateTrophyPayload,
} from './Trophy';

@Injectable({
  providedIn: 'root',
})
export class TrophyHTTP {
  private http = inject(HttpClient);
  // Endpoint canónico v1 para trofeos: /api/v1/trophies
  // environment.apiUrl es http://localhost:8088/api o https://.../api
  private apiUrl = `${environment.apiUrl}/v1/trophies`;

  /**
   * POST /api/v1/trophies
   * Crear trofeo (individual o sinergia)
   */
  createTrophy(command: CreateTrophyPayload | Partial<Trophy>): Observable<Trophy> {
    return this.http.post<Trophy>(this.apiUrl, command);
  }

  /**
   * GET /api/v1/trophies
   * Consultar trofeos (paginar, buscar, filtrar por dominio y estado)
   */
  listTrophies(params?: TrophyFilterParams): Observable<TrophyListResult> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.domain_id) httpParams = httpParams.set('domain_id', params.domain_id);
      if (params.status) httpParams = httpParams.set('status', params.status);
    }
    return this.http.get<TrophyListResult>(this.apiUrl, { params: httpParams });
  }

  /**
   * GET /api/v1/trophies/{id}
   * Detalles del trofeo y progreso de racha de hábitos
   */
  getTrophyDetails(id: string): Observable<SynergyStatus> {
    return this.http.get<SynergyStatus>(`${this.apiUrl}/${id}`);
  }

  /**
   * Alias de getTrophyDetails para mantener retrocompatibilidad con vistas
   */
  getSynergyStatus(trophyId: string): Observable<SynergyStatus> {
    return this.getTrophyDetails(trophyId);
  }

  /**
   * DELETE /api/v1/trophies/{id}
   * Eliminar trofeo (solo bloqueados/no desbloqueados)
   */
  deleteTrophy(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
