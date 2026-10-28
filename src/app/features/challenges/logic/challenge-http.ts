import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthHelper } from '../../login/logic/auth-helper';
import {
  Challenge,
  Milestone,
  CreateChallengeDto,
  UpdateChallengeDto,
  CreateMilestoneDto
} from './challenge.model';

@Injectable({
  providedIn: 'root',
})
export class ChallengeHttp {
  private http = inject(HttpClient);
  private authHelper = inject(AuthHelper);
  private token = computed(() => this.authHelper.getToken());

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token() || ''}`,
      'Content-Type': 'application/json',
    });
  }

  // --- Retos (Challenges) ---
  getChallenges(status?: string): Observable<Challenge[]> {
    const url = status
      ? `${environment.apiUrl}/challenges?status=${status}`
      : `${environment.apiUrl}/challenges`;
    return this.http.get<Challenge[]>(url, { headers: this.getHeaders() });
  }

  getChallengeById(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${environment.apiUrl}/challenges/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createChallenge(dto: CreateChallengeDto): Observable<Challenge> {
    return this.http.post<Challenge>(`${environment.apiUrl}/challenges`, dto, {
      headers: this.getHeaders(),
    });
  }

  updateChallenge(id: string, dto: UpdateChallengeDto): Observable<Challenge> {
    return this.http.put<Challenge>(`${environment.apiUrl}/challenges/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  updateChallengeStatus(
    id: string,
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ARCHIVED'
  ): Observable<Challenge> {
    return this.http.patch<Challenge>(
      `${environment.apiUrl}/challenges/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  // --- Hitos (Milestones) ---
  getMilestones(challengeId: string): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(
      `${environment.apiUrl}/challenges/${challengeId}/milestones`,
      { headers: this.getHeaders() }
    );
  }

  createMilestone(challengeId: string, dto: CreateMilestoneDto): Observable<Milestone> {
    return this.http.post<Milestone>(
      `${environment.apiUrl}/challenges/${challengeId}/milestones`,
      dto,
      { headers: this.getHeaders() }
    );
  }

  updateMilestone(
    challengeId: string,
    milestoneId: string,
    data: Partial<Milestone>
  ): Observable<Milestone> {
    return this.http.patch<Milestone>(
      `${environment.apiUrl}/challenges/${challengeId}/milestones/${milestoneId}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  deleteMilestone(challengeId: string, milestoneId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/challenges/${challengeId}/milestones/${milestoneId}`,
      { headers: this.getHeaders() }
    );
  }

  getUpcomingDeadlines(days: number = 3): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(
      `${environment.apiUrl}/challenges/upcoming-deadlines?days=${days}`,
      { headers: this.getHeaders() }
    );
  }
}
