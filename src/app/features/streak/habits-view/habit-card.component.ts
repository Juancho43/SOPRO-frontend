import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitWithStreak } from '../logic/Habit';

export interface DayStatus {
  dayLabel: string;
  dateStr: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-habit-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="habit-card">
      <div class="card-header">
        <h3 class="habit-title">{{ habit().name }}</h3>
        <div class="streak-badge">
          <span class="material-symbols-outlined fire-icon">local_fire_department</span>
          <span class="streak-count">{{ habit().currentStreak }}</span>
        </div>
      </div>

      <div class="card-body">
        <div class="heatmap-container">
          <div class="heatmap-labels">
            <span *ngFor="let day of weekLabels">{{ day }}</span>
          </div>
          <div class="heatmap-grid">
            <div 
              *ngFor="let cell of recentDays()" 
              class="heatmap-cell" 
              [class.completed]="cell.isCompleted">
            </div>
          </div>
        </div>

        <button 
          class="check-btn" 
          [class.completed]="habit().completedToday" 
          [disabled]="loading() || habit().completedToday"
          (click)="onToggle()">
          <span class="material-symbols-outlined check-icon">
            {{ habit().completedToday ? 'check' : 'add_task' }}
          </span>
          <span>{{ habit().completedToday ? 'Completado' : 'Completar' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .habit-card {
      background: #1e1e24;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .habit-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
    }

    .streak-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 700;
      font-size: 1.15rem;
      color: #ff9100;
    }

    .fire-icon {
      font-size: 20px;
    }

    .card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .heatmap-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .heatmap-labels {
      display: grid;
      grid-template-columns: repeat(7, 18px);
      gap: 4px;
      font-size: 0.65rem;
      color: #8b8b99;
      text-align: center;
      font-weight: 600;
    }

    .heatmap-grid {
      display: grid;
      grid-template-columns: repeat(7, 18px);
      grid-template-rows: repeat(2, 18px);
      gap: 4px;
    }

    .heatmap-cell {
      width: 18px;
      height: 18px;
      border-radius: 5px;
      background: #2b2b36;
      transition: all 0.2s ease;
    }

    .heatmap-cell.completed {
      background: #ffab00;
      box-shadow: 0 0 6px rgba(255, 171, 0, 0.4);
    }

    .check-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 24px;
      border: 1px solid rgba(138, 92, 246, 0.4);
      background: rgba(138, 92, 246, 0.15);
      color: #c4b5fd;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .check-btn:hover:not(:disabled) {
      background: rgba(138, 92, 246, 0.3);
      border-color: #8b5cf6;
      color: #ffffff;
      transform: translateY(-1px);
    }

    .check-btn.completed {
      background: #7c4dff;
      border-color: #7c4dff;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(124, 77, 255, 0.4);
      cursor: default;
    }

    .check-icon {
      font-size: 16px;
    }
  `]
})
export class HabitCardComponent {
  habit = input.required<HabitWithStreak>();
  historyDates = input<string[]>([]);
  loading = input<boolean>(false);
  checkIn = output<string>();

  readonly weekLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // Genera los últimos 14 días para la matriz 7x2
  recentDays = computed<DayStatus[]>(() => {
    const datesSet = new Set(this.historyDates());
    const days: DayStatus[] = [];
    const today = new Date();

    // 14 días atrás hasta hoy
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayIdx = d.getDay(); // 0 Dom, 1 Lun...
      const label = this.weekLabels[(dayIdx + 6) % 7];

      const isCompleted = datesSet.has(dateStr) || (i === 0 && this.habit().completedToday);
      days.push({
        dayLabel: label,
        dateStr,
        isCompleted
      });
    }

    return days;
  });

  onToggle() {
    if (!this.habit().completedToday && !this.loading()) {
      this.checkIn.emit(this.habit().id);
    }
  }
}
