import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TrophyHTTP } from '../logic/trophy-http';
import { HabitHTTP } from '../logic/habit-http';
import { ShowcaseTrophy } from '../logic/Trophy';
import { TrophyCardComponent } from './trophy-card.component';
import { TrophyForm } from '../trophy-form/trophy-form';

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

    // Cargamos tanto los trofeos del showcase como los hábitos para saber la racha asociada
    this.trophyHttp.getUserShowcase().subscribe({
      next: (showcaseList) => {
        this.trophies.set(showcaseList || []);
        this.loadHabitStreaks(showcaseList || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar vitrina de trofeos:', err);
        this.loading.set(false);
      }
    });
  }

  private loadHabitStreaks(trophyList: ShowcaseTrophy[]) {
    this.habitHttp.listHabits().subscribe({
      next: (habits) => {
        const streaksMap: Record<string, number> = {};
        const habitsById = new Map(habits.map((h) => [h.id, h.currentStreak]));

        trophyList.forEach((t) => {
          // Si el trofeo tiene hábitos asociados, toma la racha del hábito
          if (t.targetHabitIds && t.targetHabitIds.length > 0) {
            const hStreak = habitsById.get(t.targetHabitIds[0]) || 0;
            streaksMap[t.id] = hStreak;
          } else {
            // Si es racha maestra u otro tipo
            streaksMap[t.id] = t.unlocked ? t.targetValue : 0;
          }
        });

        this.currentStreaks.set(streaksMap);
      },
      error: (err) => {
        console.error('Error al cargar rachas de hábitos:', err);
      }
    });
  }

  openCreateTrophyModal() {
    const dialogRef = this.dialog.open(TrophyForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '380px'
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadShowcase();
      }
    });
  }
}
