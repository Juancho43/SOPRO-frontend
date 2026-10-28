import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge } from '../logic/challenge.model';

@Component({
  selector: 'app-challenge-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
})
export class ChallengeCardComponent {
  @Input({ required: true }) challenge!: Challenge;
  @Output() cardClick = new EventEmitter<string>();

  get daysRemaining(): number {
    const end = new Date(this.challenge.endDate).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get progressPercentage(): number {
    const start = new Date(this.challenge.startDate).getTime();
    const end = new Date(this.challenge.endDate).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;
    const total = end - start;
    const current = now - start;
    return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
  }

  get statusLabel(): string {
    switch (this.challenge.status) {
      case 'ACTIVE':
        return 'En Curso';
      case 'COMPLETED':
        return 'Conquistado';
      case 'FAILED':
        return 'No Logrado';
      case 'ARCHIVED':
        return 'Archivado';
      default:
        return this.challenge.status;
    }
  }

  onClick() {
    this.cardClick.emit(this.challenge.id);
  }
}
