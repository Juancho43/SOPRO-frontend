import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseTrophy } from '../logic/Trophy';

@Component({
  selector: 'app-trophy-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trophy-card" [class.unlocked]="trophy().unlocked" [class.locked]="!trophy().unlocked">
      <div class="top-indicator">
        <span *ngIf="!trophy().unlocked" class="material-symbols-outlined lock-icon">lock</span>
      </div>

      <div class="trophy-visual">
        <div class="icon-halo" [class.glow]="trophy().unlocked">
          <span class="material-symbols-outlined trophy-icon">{{ trophyIcon() }}</span>
        </div>
      </div>

      <div class="trophy-info">
        <h4 class="trophy-title">{{ trophy().name }}</h4>
        <div class="streak-target">
          <span class="material-symbols-outlined fire-small">local_fire_department</span>
          <span>Racha de {{ trophy().targetValue }} días</span>
        </div>

        <div class="action-status">
          <ng-container *ngIf="trophy().unlocked; else progressTpl">
            <div class="unlocked-badge">
              <span>Desbloqueado</span>
              <span class="material-symbols-outlined check-mark">check</span>
            </div>
          </ng-container>

          <ng-template #progressTpl>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
              </div>
              <span class="progress-text">{{ currentDays() }}/{{ trophy().targetValue }} días</span>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .trophy-card {
      background: #181820;
      border-radius: 20px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
    }

    .trophy-card.unlocked {
      background: linear-gradient(180deg, rgba(30, 26, 46, 0.9) 0%, rgba(20, 18, 30, 0.95) 100%);
      border-color: rgba(255, 171, 0, 0.25);
    }

    .top-indicator {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .lock-icon {
      font-size: 16px;
      color: #6b7280;
    }

    .trophy-visual {
      margin: 10px 0 12px 0;
      position: relative;
    }

    .icon-halo {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-halo.glow {
      background: radial-gradient(circle, rgba(255, 171, 0, 0.25) 0%, rgba(255, 171, 0, 0.02) 70%);
      box-shadow: 0 0 24px rgba(255, 171, 0, 0.3);
    }

    .trophy-icon {
      font-size: 40px;
      color: #6b7280;
    }

    .unlocked .trophy-icon {
      color: #ffb703;
      filter: drop-shadow(0 2px 8px rgba(255, 183, 3, 0.6));
    }

    .trophy-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .trophy-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
      line-height: 1.25;
      min-height: 2.5em;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .streak-target {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .fire-small {
      font-size: 14px;
      color: #ff9100;
    }

    .action-status {
      margin-top: 8px;
      width: 100%;
    }

    .unlocked-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255, 171, 0, 0.5);
      background: rgba(255, 171, 0, 0.1);
      color: #ffb703;
      font-size: 0.78rem;
      font-weight: 600;
      width: 100%;
      box-sizing: border-box;
    }

    .check-mark {
      font-size: 14px;
    }

    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #272733;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #7c4dff;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.72rem;
      color: #8b8b99;
      font-weight: 500;
    }
  `]
})
export class TrophyCardComponent {
  trophy = input.required<ShowcaseTrophy>();
  currentStreak = input<number>(0);

  trophyIcon = computed(() => {
    return this.trophy().icon || 'military_tech';
  });

  currentDays = computed(() => {
    return Math.min(this.currentStreak(), this.trophy().targetValue);
  });

  progressPercentage = computed(() => {
    if (this.trophy().unlocked) return 100;
    const target = this.trophy().targetValue || 1;
    return Math.min(Math.round((this.currentDays() / target) * 100), 100);
  });
}
