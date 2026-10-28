import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of, tap } from 'rxjs';
import { ChallengeHttp } from './challenge-http';
import {
  Challenge,
  Milestone,
  CreateChallengeDto,
  UpdateChallengeDto,
  CreateMilestoneDto,
} from './challenge.model';

@Injectable({
  providedIn: 'root',
})
export class ChallengeHelper {
  private service = inject(ChallengeHttp);

  // Filtro de retos (ACTIVE por defecto o 'ALL')
  public selectedStatus = signal<'ACTIVE' | 'COMPLETED' | 'ALL'>('ACTIVE');

  // ID del reto actualmente seleccionado para vista detalle
  public currentChallengeId = signal<string | null>(null);

  // Recursos reactivos
  private challengesResource = rxResource<Challenge[], 'ACTIVE' | 'COMPLETED' | 'ALL'>({
    params: () => this.selectedStatus(),
    stream: ({ params }) => {
      const status = params === 'ALL' ? undefined : params;
      return this.service.getChallenges(status);
    },
  });

  private currentChallengeResource = rxResource<Challenge | null, string | null>({
    params: () => this.currentChallengeId(),
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.service.getChallengeById(params);
    },
  });

  private milestonesResource = rxResource<Milestone[], string | null>({
    params: () => this.currentChallengeId(),
    stream: ({ params }) => {
      if (!params) return of([]);
      return this.service.getMilestones(params);
    },
  });

  private upcomingDeadlinesResource = rxResource<Milestone[], void>({
    stream: () => this.service.getUpcomingDeadlines(3),
  });

  // Señales públicas computadas
  public challenges = computed<Challenge[]>(() =>
    this.challengesResource.isLoading() || this.challengesResource.error()
      ? []
      : this.challengesResource.value() ?? []
  );

  public isLoadingChallenges = computed<boolean>(() => this.challengesResource.isLoading());

  public currentChallenge = computed<Challenge | null>(() =>
    this.currentChallengeResource.isLoading() || this.currentChallengeResource.error()
      ? null
      : this.currentChallengeResource.value() ?? null
  );

  public milestones = computed<Milestone[]>(() =>
    this.milestonesResource.isLoading() || this.milestonesResource.error()
      ? []
      : this.milestonesResource.value() ?? []
  );

  public upcomingDeadlines = computed<Milestone[]>(() =>
    this.upcomingDeadlinesResource.isLoading() || this.upcomingDeadlinesResource.error()
      ? []
      : this.upcomingDeadlinesResource.value() ?? []
  );

  // Cálculo de progreso porcentual del reto actual
  public currentChallengeProgress = computed<number>(() => {
    const list = this.milestones();
    if (!list || list.length === 0) return 0;
    const completed = list.filter((m: Milestone) => m.isCompleted).length;
    return Math.round((completed / list.length) * 100);
  });

  // Métodos de mutación y recarga
  public setFilter(status: 'ACTIVE' | 'COMPLETED' | 'ALL') {
    this.selectedStatus.set(status);
  }

  public selectChallenge(id: string | null) {
    this.currentChallengeId.set(id);
  }

  public reloadChallenges() {
    this.challengesResource.reload();
    this.upcomingDeadlinesResource.reload();
  }

  public reloadCurrentChallenge() {
    this.currentChallengeResource.reload();
    this.milestonesResource.reload();
  }

  public createChallenge(dto: CreateChallengeDto): Observable<Challenge> {
    return this.service.createChallenge(dto).pipe(
      tap(() => {
        this.reloadChallenges();
      })
    );
  }

  public updateChallenge(id: string, dto: UpdateChallengeDto): Observable<Challenge> {
    return this.service.updateChallenge(id, dto).pipe(
      tap(() => {
        this.reloadChallenges();
        if (this.currentChallengeId() === id) {
          this.reloadCurrentChallenge();
        }
      })
    );
  }

  public updateStatus(
    id: string,
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ARCHIVED'
  ): Observable<Challenge> {
    return this.service.updateChallengeStatus(id, status).pipe(
      tap(() => {
        this.reloadChallenges();
        if (this.currentChallengeId() === id) {
          this.reloadCurrentChallenge();
        }
      })
    );
  }

  public addMilestone(challengeId: string, dto: CreateMilestoneDto): Observable<Milestone> {
    return this.service.createMilestone(challengeId, dto).pipe(
      tap(() => {
        this.milestonesResource.reload();
        this.upcomingDeadlinesResource.reload();
      })
    );
  }

  public toggleMilestone(challengeId: string, milestone: Milestone): Observable<Milestone> {
    const isCompleted = !milestone.isCompleted;
    const completedAt = isCompleted ? new Date().toISOString() : undefined;
    return this.service
      .updateMilestone(challengeId, milestone.id, { isCompleted, completedAt })
      .pipe(
        tap(() => {
          this.milestonesResource.reload();
          this.upcomingDeadlinesResource.reload();
        })
      );
  }

  public deleteMilestone(challengeId: string, milestoneId: string): Observable<void> {
    return this.service.deleteMilestone(challengeId, milestoneId).pipe(
      tap(() => {
        this.milestonesResource.reload();
        this.upcomingDeadlinesResource.reload();
      })
    );
  }
}
