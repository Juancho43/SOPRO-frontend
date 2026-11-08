import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TrophyHTTP } from '../logic/trophy-http';
import { HabitHTTP } from '../logic/habit-http';
import { ShowcaseTrophy } from '../logic/Trophy';
import { TrophyCardComponent } from './trophy-card.component';
import { TrophyForm } from '../trophy-form/trophy-form';
import { TrophyDetailModalComponent } from './trophy-detail-modal.component';

@Component({
  selector: 'app-trophies-view',
  standalone: true,
  imports: [CommonModule, TrophyCardComponent],
  templateUrl: './trophies-view.html',
  styleUrl: './trophies-view.scss',
})
export class TrophiesView implements OnInit {
  private trophyHttp = inject(TrophyHTTP);
  private habitHttp = inject(HabitHTTP);
  private dialog = inject(MatDialog);

  trophies = signal<ShowcaseTrophy[]>([]);
  currentStreaks = signal<Record<string, number>>({});
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadShowcase();
  }

  loadShowcase() {
    this.loading.set(true);

    // GET /api/v1/trophies (con paginación/filtros)
    this.trophyHttp.listTrophies({ limit: 100 }).subscribe({
      next: (res) => {
        const list = res?.trophies || [];
        // Normalizamos compatibilidad de campos
        const normalized = list.map((t) => ({
          ...t,
          unlocked: t.unlocked ?? t.isUnlocked ?? false,
          targetValue: t.required_streak_days ?? t.targetValue ?? 0,
        }));

        this.trophies.set(normalized);
        this.loadHabitStreaks(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar vitrina de trofeos:', err);
        this.loading.set(false);
      },
    });
  }

  private loadHabitStreaks(trophyList: ShowcaseTrophy[]) {
    this.habitHttp.listHabits().subscribe({
      next: (habits) => {
        const streaksMap: Record<string, number> = {};
        const habitsById = new Map(habits.map((h) => [h.id, h.currentStreak]));

        trophyList.forEach((t) => {
          if (t.habit_id) {
            streaksMap[t.id] = habitsById.get(t.habit_id) || 0;
          } else if (t.targetHabitIds && t.targetHabitIds.length > 0) {
            const hStreak = habitsById.get(t.targetHabitIds[0]) || 0;
            streaksMap[t.id] = hStreak;
          } else if (t.conditions && t.conditions.length > 0) {
            const minStreak = Math.min(
              ...t.conditions.map((c) => habitsById.get(c.habit_id) || 0)
            );
            streaksMap[t.id] = minStreak;
          } else {
            streaksMap[t.id] = t.unlocked ? (t.required_streak_days || t.targetValue || 0) : 0;
          }
        });

        this.currentStreaks.set(streaksMap);
      },
      error: (err) => {
        console.error('Error al cargar rachas de hábitos:', err);
      },
    });
  }

  openCreateTrophyModal() {
    const dialogRef = this.dialog.open(TrophyForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '380px',
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadShowcase();
      }
    });
  }

  openTrophyDetail(trophy: ShowcaseTrophy) {
    const streak = this.currentStreaks()[trophy.id] || 0;
    const dialogRef = this.dialog.open(TrophyDetailModalComponent, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '420px',
      data: {
        trophy,
        currentStreak: streak,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted) {
        this.loadShowcase();
      }
    });
  }
}
