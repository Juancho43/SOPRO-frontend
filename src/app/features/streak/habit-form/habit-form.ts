import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required } from '@angular/forms/signals';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomainWithHabitCount } from '../logic/Domain';
import { HabitHTTP } from '../logic/habit-http';
import { DomainHTTP } from '../logic/domain-http';
import { HabitWithStreak } from '../logic/Habit';
import { FormsModule } from '@angular/forms';

export interface HabitModalData {
  mode: 'create' | 'edit';
  habit?: HabitWithStreak;
}

interface HabitFormModel {
  name: string;
  frequency: string;
  weeklyTarget: string;
  domainId: string;
}

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, FormField, FormsModule],
  templateUrl: './habit-form.html',
  styleUrl: './habit-form.scss',
})
export class HabitForm implements OnInit {
  private habitService = inject(HabitHTTP);
  private domainService = inject(DomainHTTP);
  public dialogRef = inject(MatDialogRef<HabitForm>, { optional: true });
  public data: HabitModalData = inject(MAT_DIALOG_DATA, { optional: true }) || { mode: 'create' };

  public domains = signal<DomainWithHabitCount[]>([]);
  public isEdit = signal<boolean>(false);
  public isSubmitting = signal<boolean>(false);
  public isDeleting = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public habitModel = signal<HabitFormModel>({
    name: '',
    frequency: 'daily',
    weeklyTarget: '5',
    domainId: '',
  });

  public habitForm = form(this.habitModel, (h) => {
    required(h.name, { message: 'El nombre del hábito es obligatorio.' });
    required(h.frequency, { message: 'La frecuencia es obligatoria.' });
  });

  ngOnInit() {
    if (this.data?.mode === 'edit' && this.data.habit) {
      this.isEdit.set(true);
      const freq = this.data.habit.frequency || 'daily';
      this.habitModel.set({
        name: this.data.habit.name,
        frequency: freq,
        weeklyTarget: String(this.data.habit.weeklyTarget || this.data.habit.weekly_target || (freq === 'weekdays' ? 5 : 3)),
        domainId: this.data.habit.domainId || this.data.habit.domain_id || '',
      });
    }

    this.domainService.listDomains().subscribe({
      next: (res) => this.domains.set(res || []),
      error: (err: unknown) => console.error('Error al listar dominios:', err),
    });
  }

  submit() {
    if (this.habitForm().invalid() || this.isSubmitting() || this.isDeleting()) {
      return;
    }

    const formVal = this.habitForm().value();
    const freq = formVal.frequency;
    let target = Number(formVal.weeklyTarget);
    if (freq === 'daily') {
      target = 7;
    } else if (freq === 'weekdays') {
      target = 5;
    } else if (!target || target < 1 || target > 7) {
      target = 3;
    }

    const payload = {
      ...formVal,
      weeklyTarget: target,
      weekly_target: target,
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    if (this.isEdit() && this.data.habit) {
      this.habitService.updateHabit(this.data.habit.id, payload).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.dialogRef?.close({ updated: true, habit: res });
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          const msg = (err as any)?.error?.error || 'Error al actualizar hábito.';
          this.errorMessage.set(msg);
          console.error('Error al actualizar hábito:', err);
        },
      });
    } else {
      this.habitService.createHabit(payload).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.dialogRef?.close({ created: true, habit: res });
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          const msg = (err as any)?.error?.error || 'Error al crear hábito.';
          this.errorMessage.set(msg);
          console.error('Error al crear hábito:', err);
        },
      });
    }
  }

  deleteHabit() {
    if (!this.isEdit() || !this.data.habit || this.isDeleting() || this.isSubmitting()) {
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar el hábito "${this.data.habit.name}"?`)) {
      return;
    }

    this.isDeleting.set(true);
    this.errorMessage.set(null);

    this.habitService.deleteHabit(this.data.habit.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.dialogRef?.close({ deleted: true, habitId: this.data.habit!.id });
      },
      error: (err: unknown) => {
        this.isDeleting.set(false);
        const msg = (err as any)?.error?.error || 'Error al eliminar hábito.';
        this.errorMessage.set(msg);
        console.error('Error al eliminar hábito:', err);
      },
    });
  }

  close() {
    this.dialogRef?.close();
  }
}
