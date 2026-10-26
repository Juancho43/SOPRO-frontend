import { Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form, min, required } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { HabitWithStreak } from '../logic/Habit';
import { TrophyHTTP } from '../logic/trophy-http';
import { HabitHTTP } from '../logic/habit-http';
import { FormsModule } from '@angular/forms';

interface CompoundTrophyFormModel {
  name: string;
  description: string;
  icon: string;
  conditionType: string;
  targetValue: number;
}

@Component({
  selector: 'app-compound-trophy-form',
  imports: [FormField,FormsModule],
  templateUrl: './compound-trophy-form.html',
  styleUrl: './compound-trophy-form.scss',
})
export class CompoundTrophyForm implements OnInit {
  private trophyService = inject(TrophyHTTP);
  private habitService = inject(HabitHTTP);
  private dialogRef = inject(MatDialogRef<CompoundTrophyForm>, { optional: true });

  public habits = signal<HabitWithStreak[]>([]);
  public selectedHabitIds = signal<string[]>([]);
  public isSubmitting = signal(false);

  public trophyModel = signal<CompoundTrophyFormModel>({
    name: '',
    description: 'Sinergia de alto rendimiento',
    icon: 'hub',
    conditionType: 'synergy',
    targetValue: 30,
  });

  public trophyForm = form(this.trophyModel, (t) => {
    required(t.name, { message: 'El nombre de la sinergia es obligatorio.' });
    required(t.icon, { message: 'El icono es obligatorio.' });
    required(t.targetValue, { message: 'Los días de racha son obligatorios.' });
    min(t.targetValue, 1, { message: 'El objetivo debe ser al menos 1 día.' });
  });

  ngOnInit() {
    this.habitService.listHabits().subscribe({
      next: (res) => this.habits.set(res || []),
      error: (err: unknown) => console.error('Error al listar hábitos:', err),
    });
  }

  onHabitsSelectionChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map((opt) => opt.value);
    this.selectedHabitIds.set(selected);
  }

  submit() {
    if (this.trophyForm().invalid() || this.selectedHabitIds().length < 2 || this.isSubmitting()) {
      return;
    }

    const payload = {
      ...this.trophyForm().value(),
      targetHabitIds: this.selectedHabitIds(),
    };
    this.isSubmitting.set(true);

    this.trophyService.createTrophy(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.dialogRef?.close(res);
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Error al crear sinergia:', err);
      },
    });
  }
}
