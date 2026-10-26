import { Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form, min, required } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { HabitWithStreak } from '../logic/Habit';
import { TrophyHTTP } from '../logic/trophy-http';
import { HabitHTTP } from '../logic/habit-http';
import { FormsModule } from '@angular/forms';

interface TrophyFormModel {
  name: string;
  description: string;
  icon: string;
  conditionType: string;
  targetValue: number;
  targetHabitId: string;
}

@Component({
  selector: 'app-trophy-form',
  imports: [FormField,FormsModule],
  templateUrl: './trophy-form.html',
  styleUrl: './trophy-form.scss',
})
export class TrophyForm implements OnInit {
  private trophyService = inject(TrophyHTTP);
  private habitService = inject(HabitHTTP);
  private dialogRef = inject(MatDialogRef<TrophyForm>, { optional: true });

  public habits = signal<HabitWithStreak[]>([]);
  public isSubmitting = signal(false);

  public trophyModel = signal<TrophyFormModel>({
    name: '',
    description: 'Logro por consistencia',
    icon: 'emoji_events',
    conditionType: 'habit_streak',
    targetValue: 7,
    targetHabitId: '',
  });

  public trophyForm = form(this.trophyModel, (t) => {
    required(t.name, { message: 'El nombre del trofeo es obligatorio.' });
    required(t.icon, { message: 'El icono es obligatorio.' });
    required(t.targetValue, { message: 'El umbral de días es obligatorio.' });
    min(t.targetValue, 1, { message: 'El umbral debe ser al menos 1 día.' });
    required(t.targetHabitId, { message: 'Debes seleccionar un hábito.' });
  });

  ngOnInit() {
    this.habitService.listHabits().subscribe({
      next: (res) => this.habits.set(res || []),
      error: (err: unknown) => console.error('Error al listar hábitos:', err),
    });
  }

  submit() {
    if (this.trophyForm().invalid() || this.isSubmitting()) {
      return;
    }

    const raw = this.trophyForm().value();
    const payload = {
      ...raw,
      targetHabitIds: [raw.targetHabitId],
    };
    this.isSubmitting.set(true);

    this.trophyService.createTrophy(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.dialogRef?.close(res);
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Error al crear trofeo:', err);
      },
    });
  }
}
