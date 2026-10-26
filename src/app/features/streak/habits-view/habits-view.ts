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
        // Actualizamos de forma reactiva el hábito en la lista
        this.habits.update((list) =>
          list.map((h) => {
            if (h.id === habitId) {
              return {
                ...h,
                currentStreak: result.newStreak ?? h.currentStreak + 1,
                completedToday: true
              };
            }
            return h;
          })
        );
        this.checkingInId.set(null);
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
      width: '380px'
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadHabits();
      }
    });
  }
}
