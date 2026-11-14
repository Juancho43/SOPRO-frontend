import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HabitHTTP } from '../logic/habit-http';
import { HabitWithStreak } from '../logic/Habit';
import { HabitCardComponent } from './habit-card.component';
import { HabitForm } from '../habit-form/habit-form';

@Component({
  selector: 'app-habits-view',
  standalone: true,
  imports: [CommonModule, HabitCardComponent],
  templateUrl: './habits-view.html',
  styleUrl: './habits-view.scss',
})
export class HabitsView implements OnInit {
  private habitHttp = inject(HabitHTTP);
  private dialog = inject(MatDialog);

  habits = signal<HabitWithStreak[]>([]);
  histories = signal<Record<string, string[]>>({});
  loading = signal<boolean>(true);
  checkingInId = signal<string | null>(null);

  ngOnInit() {
    this.loadHabits();
  }

  loadHabits() {
    this.loading.set(true);
    this.habitHttp.listHabits().subscribe({
      next: (data) => {
        this.habits.set(data || []);
        this.loading.set(false);
        this.loadHistories(data || []);
      },
      error: (err) => {
        console.error('Error al cargar hábitos:', err);
        this.loading.set(false);
      }
    });
  }

  private loadHistories(habitsList: HabitWithStreak[]) {
    habitsList.forEach((h) => {
      this.habitHttp.getHabitHistory(h.id).subscribe({
        next: (dates) => {
          this.histories.update((current) => ({
            ...current,
            [h.id]: dates || []
          }));
        },
        error: (err) => {
          console.error(`Error al cargar historial para hábito ${h.id}:`, err);
        }
      });
    });
  }

  onHabitCheckIn(habitId: string) {
    this.checkingInId.set(habitId);
    this.habitHttp.checkInHabit(habitId).subscribe({
      next: (result) => {
        const newStreak = Number(result.currentStreak ?? result.newStreak ?? 0);
        // Actualizamos de forma reactiva el hábito en la lista
        this.habits.update((list) =>
          list.map((h) => {
            if (h.id === habitId) {
              const prev = Number(h.currentStreak ?? h.current_streak ?? 0);
              const streak = newStreak > 0 ? newStreak : prev + 1;
              return {
                ...h,
                currentStreak: streak,
                current_streak: streak,
                completedToday: true,
                completed_today: true,
              };
            }
            return h;
          })
        );
        this.checkingInId.set(null);

        // Recargar historial del hábito para actualizar el mapa de calor reactivamente
        this.habitHttp.getHabitHistory(habitId).subscribe({
          next: (dates) => {
            this.histories.update((current) => ({
              ...current,
              [habitId]: dates || [],
            }));
          },
        });
      },
      error: (err) => {
        console.error('Error al marcar hábito:', err);
        this.checkingInId.set(null);
      }
    });
  }

  openCreateHabitModal() {
    const dialogRef = this.dialog.open(HabitForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '400px',
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loadHabits();
      }
    });
  }

  openEditHabitModal(habit: HabitWithStreak) {
    const dialogRef = this.dialog.open(HabitForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '400px',
      data: {
        mode: 'edit',
        habit,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loadHabits();
      }
    });
  }
}
