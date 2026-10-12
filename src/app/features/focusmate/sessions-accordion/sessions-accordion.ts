import { Component, computed, input, signal } from '@angular/core';
import { FocusmateSession } from '../logic/focumateSession';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sessions-accordion',
  imports: [DatePipe],
  templateUrl: './sessions-accordion.html',
  styleUrl: './sessions-accordion.scss',
})
export class SessionsAccordion {
public sessions = input<FocusmateSession[]>([]);
  
  // Estado reactivo del acordeón
  public isExpanded = signal<boolean>(false);

  // Orden cronológico innegociable
  public sortedSessions = computed(() => {
    return [...this.sessions()].sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  });

  // El foco absoluto: tu próxima victoria
  public nextSession = computed(() => {
    const now = new Date().getTime();
    return this.sortedSessions().find(s => new Date(s.end_time).getTime() > now) || null;
  });

  // Vista resumida: solo las que siguen
  public upcomingSessions = computed(() => {
    const next = this.nextSession();
    if (!next) return [];
    return this.sortedSessions().filter(s => 
      new Date(s.start_time).getTime() > new Date(next.start_time).getTime()
    );
  });

  public totalToday = computed(() => this.sessions().length);
  public completedToday = computed(() => {
    const now = new Date().getTime();
    return this.sessions().filter(s => new Date(s.end_time).getTime() <= now).length;
  });

  public getDuration(session: FocusmateSession): number {
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    return Math.round((end - start) / 60000);
  }

  // Alternar el panel
  public toggleAccordion(): void {
    this.isExpanded.update(v => !v);
  }

  // Clasificador de estado para la línea de tiempo
  public getSessionStatus(session: FocusmateSession): 'past' | 'next' | 'future' {
    const now = new Date().getTime();
    const end = new Date(session.end_time).getTime();
    const next = this.nextSession();

    if (end <= now) return 'past';
    if (next && session.id === next.id) return 'next';
    return 'future';
  }
}
