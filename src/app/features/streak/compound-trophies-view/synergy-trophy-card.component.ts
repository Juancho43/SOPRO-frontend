import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynergyStatus } from '../logic/Trophy';

export interface SynergyTrophyModel {
  id: string;
  name: string;
  description?: string;
  rarity?: 'Epic' | 'Legendary' | 'Rare';
  icon?: string;
  requiredStreakDays: number;
}

@Component({
  selector: 'app-synergy-trophy-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="synergy-card" [class.unlocked]="isUnlocked()">
      <div class="card-top">
        <div class="rarity-badge">{{ rarityLabel() }}</div>
        <div class="lock-indicator" *ngIf="!isUnlocked()">
          <span class="material-symbols-outlined lock-icon">lock</span>
        </div>
      </div>

      <div class="card-main">
        <div class="trophy-illustration">
          <div class="halo-circle" [class.glowing]="isUnlocked()">
            <span class="material-symbols-outlined trophy-large">{{ trophyIcon() }}</span>
          </div>
        </div>

        <div class="trophy-details">
          <h3 class="synergy-title">{{ trophy().name }}</h3>
          
          <!-- Combo pill -->
          <div class="combo-pill">
            <span class="combo-label">Combo:</span>
            <span class="combo-text">{{ comboText() }}</span>
          </div>

          <!-- Racha combinada y barra de progreso -->
          <div class="progress-section">
            <div class="progress-info">
              <span>Racha combinada: {{ currentCombinedStreak() }}/{{ trophy().requiredStreakDays }} días</span>
              <span class="progress-pct">{{ progressPercentage() }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chips de hábitos que componen la sinergia -->
      <div class="habits-combo-chips">
        @for (item of status()?.habitProgress || []; track item.habitId) {
          <div class="habit-check-chip" [class.done]="item.currentStreak >= item.requiredStreak">
            <span class="habit-chip-name">{{ item.habitName }}</span>
            <span class="material-symbols-outlined status-icon">
              {{ item.currentStreak >= item.requiredStreak ? 'check' : 'hourglass_top' }}
            </span>
          </div>
        }
      </div>

      <!-- Footer estado -->
      <div class="card-footer">
        @if (isUnlocked()) {
          <div class="status-footer active">
            <span class="material-symbols-outlined icon-status">military_tech</span>
            <span>Activo - Nivel {{ level() }}</span>
          </div>
        } @else {
          <div class="status-footer locked">
            <span class="material-symbols-outlined icon-status">lock</span>
            <span>Bloqueado</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .synergy-card {
      background: #181820;
      border-radius: 20px;
      padding: 18px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
    }

    .synergy-card.unlocked {
      border-color: rgba(139, 92, 246, 0.3);
      background: linear-gradient(180deg, rgba(28, 22, 44, 0.9) 0%, rgba(18, 16, 26, 0.95) 100%);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .rarity-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: #c4b5fd;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .lock-icon {
      font-size: 16px;
      color: #6b7280;
    }

    .card-main {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .trophy-illustration {
      flex-shrink: 0;
    }

    .halo-circle {
      width: 76px;
      height: 76px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .halo-circle.glowing {
      background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.02) 70%);
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
    }

    .trophy-large {
      font-size: 44px;
      color: #6b7280;
    }

    .unlocked .trophy-large {
      color: #c084fc;
      filter: drop-shadow(0 2px 10px rgba(192, 132, 252, 0.6));
    }

    .trophy-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .synergy-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .combo-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
    }

    .combo-label {
      color: #9ca3af;
    }

    .combo-text {
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 12px;
      color: #e5e7eb;
      font-weight: 500;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 4px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .progress-pct {
      font-weight: 600;
      color: #ffffff;
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
      background: linear-gradient(90deg, #8b5cf6 0%, #f97316 100%);
      border-radius: 3px;
      transition: width 0.4s ease;
    }

    .habits-combo-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .habit-check-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 16px;
      background: #232330;
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.78rem;
      color: #9ca3af;

      &.done {
        background: rgba(139, 92, 246, 0.15);
        border-color: rgba(139, 92, 246, 0.4);
        color: #e9d5ff;

        .status-icon {
          color: #a855f7;
        }
      }

      .status-icon {
        font-size: 14px;
      }
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      padding-top: 10px;
    }

    .status-footer {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
      font-weight: 600;

      &.active {
        color: #fbbf24;
      }

      &.locked {
        color: #6b7280;
      }

      .icon-status {
        font-size: 16px;
      }
    }
  `]
})
export class SynergyTrophyCardComponent {
  trophy = input.required<SynergyTrophyModel>();
  status = input<SynergyStatus | null>(null);

  isUnlocked = computed(() => {
    return this.status()?.isCompleted ?? false;
  });

  trophyIcon = computed(() => {
    return this.trophy().icon || 'workspace_premium';
  });

  rarityLabel = computed(() => {
    const r = this.trophy().rarity || 'Epic';
    return `${r} / ${r === 'Epic' ? 'Épico' : 'Legendario'}`;
  });

  comboText = computed(() => {
    const list = this.status()?.habitProgress;
    if (list && list.length > 0) {
      return list.map((item) => item.habitName).join(' + ');
    }
    return this.trophy().description || 'Hábito A + Hábito B';
  });

  currentCombinedStreak = computed(() => {
    const list = this.status()?.habitProgress;
    if (!list || list.length === 0) return 0;
    // La racha combinada efectiva es el mínimo de las rachas de los hábitos que componen la sinergia
    return Math.min(...list.map((h) => h.currentStreak));
  });

  progressPercentage = computed(() => {
    const target = this.trophy().requiredStreakDays || 1;
    return Math.min(Math.round((this.currentCombinedStreak() / target) * 100), 100);
  });

  level = computed(() => {
    return Math.max(1, Math.floor(this.currentCombinedStreak() / 7) + 1);
  });
}
