import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitWithStreak } from '../logic/Habit';

export interface DayStatus {
  dayLabel: string;
  dateStr: string;
  isCompleted: boolean;
  isRestDay: boolean;
}

@Component({
  selector: 'app-habit-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="habit-card" (click)="onCardClick()">
      <div class="card-header">
        <div class="title-container">
          <h3 class="habit-title">{{ habit().name }}</h3>
          @if (habit().domainName || habit().domain_name) {
            <span 
              class="domain-pill"
              [style.borderColor]="habit().domainColor || habit().domain_color || '#8b5cf6'"
              [style.color]="habit().domainColor || habit().domain_color || '#c4b5fd'">
              {{ habit().domainName || habit().domain_name }}
            </span>
          }
          <span class="freq-pill">
            {{ frequencyLabel() }}
          </span>
          @if (isWeekendRestDay()) {
            <span class="rest-pill" title="Día de descanso programado">
              Descanso 💤
            </span>
          }
        </div>
        <div class="header-right">
          <div class="streak-badge">
            <span class="material-symbols-outlined fire-icon">local_fire_department</span>
            <span class="streak-count">{{ streakValue() }}</span>
          </div>
          <button 
            type="button" 
            class="edit-btn" 
            title="Editar o eliminar hábito"
            (click)="onEditClick($event)">
            <span class="material-symbols-outlined edit-icon">edit</span>
          </button>
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
              [class.completed]="cell.isCompleted"
              [class.rest-day]="cell.isRestDay"
              [title]="cell.dateStr + (cell.isCompleted ? ' (Completado)' : (cell.isRestDay ? ' (Descanso programado)' : ' (Pendiente)'))">
            </div>
          </div>
        </div>

        <button 
          class="check-btn" 
          [class.completed]="isCompletedToday()" 
          [class.rest-btn]="isWeekendRestDay() && !isCompletedToday()"
          [disabled]="loading() || isCompletedToday()"
          (click)="onToggle($event)">
          <span class="material-symbols-outlined check-icon">
            {{ isCompletedToday() ? 'check' : (isWeekendRestDay() ? 'bedtime' : 'add_task') }}
          </span>
          <span>
            {{ isCompletedToday() ? 'Completado' : (isWeekendRestDay() ? 'Completar (Extra)' : 'Completar') }}
          </span>
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
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .habit-card:hover {
      border-color: rgba(138, 92, 246, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .title-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .habit-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
    }

    .domain-pill {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      border: 1px solid;
      background: rgba(255, 255, 255, 0.04);
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .freq-pill {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      background: rgba(138, 92, 246, 0.12);
      border: 1px solid rgba(138, 92, 246, 0.25);
      color: #c4b5fd;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .rest-pill {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      background: rgba(148, 163, 184, 0.12);
      border: 1px solid rgba(148, 163, 184, 0.25);
      color: #94a3b8;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
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

    .edit-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .edit-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .edit-icon {
      font-size: 18px;
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

    .heatmap-cell.rest-day {
      background: #22222b;
      border: 1px dashed rgba(255, 255, 255, 0.15);
      opacity: 0.6;
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

    .check-btn.rest-btn {
      border-color: rgba(148, 163, 184, 0.3);
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
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
  edit = output<HabitWithStreak>();

  readonly weekLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  frequencyLabel = computed(() => {
    const f = this.habit().frequency;
    if (f === 'weekdays') return 'Lun - Vie (5d)';
    if (f === 'weekly') {
      const target = this.habit().weeklyTarget || this.habit().weekly_target || 3;
      return `${target}x/sem`;
    }
    return 'Diario';
  });

  isWeekendRestDay = computed(() => {
    if (this.habit().frequency !== 'weekdays') return false;
    const today = new Date().getDay(); // 0 is Sunday, 6 is Saturday
    return today === 0 || today === 6;
  });

  streakValue = computed(() => {
    const val = this.habit().currentStreak ?? this.habit().current_streak ?? 0;
    return Number.isNaN(val) ? 0 : Number(val);
  });

  isCompletedToday = computed(() => {
    return Boolean(this.habit().completedToday || this.habit().completed_today);
  });

  // Genera los últimos 14 días para la matriz 7x2
  recentDays = computed<DayStatus[]>(() => {
    const datesSet = new Set(this.historyDates());
    const days: DayStatus[] = [];
    const today = new Date();
    const isWeekdays = this.habit().frequency === 'weekdays';

    // 14 días atrás hasta hoy
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayIdx = d.getDay(); // 0 Dom, 1 Lun...
      const label = this.weekLabels[(dayIdx + 6) % 7];
      const isWeekend = dayIdx === 0 || dayIdx === 6;

      const isCompleted = datesSet.has(dateStr) || (i === 0 && this.isCompletedToday());
      const isRestDay = isWeekdays && isWeekend && !isCompleted;

      days.push({
        dayLabel: label,
        dateStr,
        isCompleted,
        isRestDay,
      });
    }

    return days;
  });

  onCardClick() {
    this.edit.emit(this.habit());
  }

  onEditClick(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.habit());
  }

  onToggle(event: MouseEvent) {
    event.stopPropagation();
    if (!this.isCompletedToday() && !this.loading()) {
      this.checkIn.emit(this.habit().id);
    }
  }
}
