import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, required, maxLength } from '@angular/forms/signals';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChallengeHelper } from '../logic/challenge-helper';
import { Challenge } from '../logic/challenge.model';

interface ChallengeFormModel {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reward: string;
}

@Component({
  selector: 'app-challenge-form',
  imports: [FormField],
  templateUrl: './challenge-form.component.html',
  styleUrl: './challenge-form.component.scss',
})
export class ChallengeFormComponent {
  private dialogRef = inject(MatDialogRef<ChallengeFormComponent>);
  private challengeHelper = inject(ChallengeHelper);
  public data: { mode: 'create' | 'edit'; challenge?: Challenge } = inject(MAT_DIALOG_DATA, {
    optional: true,
  }) || { mode: 'create' };

  public isEdit = this.data?.mode === 'edit';
  public isSubmitting = signal(false);

  private getDefaultStartDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private calculateDefaultEndDate(days: number): string {
    const start = new Date(this.data?.challenge?.startDate || this.getDefaultStartDate());
    start.setDate(start.getDate() + days);
    return start.toISOString().split('T')[0];
  }

  public challengeModel = signal<ChallengeFormModel>({
    title: this.data?.challenge?.title || '',
    description: this.data?.challenge?.description || '',
    startDate: this.data?.challenge?.startDate || this.getDefaultStartDate(),
    endDate: this.data?.challenge?.endDate || this.calculateDefaultEndDate(90),
    reward: this.data?.challenge?.reward || '',
  });

  public challengeForm = form(this.challengeModel, (p) => {
    required(p.title, { message: 'El título del reto es obligatorio.' });
    maxLength(p.title, 120, { message: 'El título no puede exceder 120 caracteres.' });
    required(p.description, { message: 'El objetivo medible es obligatorio.' });
    required(p.startDate, { message: 'La fecha de inicio es obligatoria.' });
    required(p.endDate, { message: 'La fecha de fin es obligatoria.' });
    required(p.reward, { message: 'La recompensa es obligatoria.' });
  });

  public isDateRangeInvalid = computed(() => {
    const start = this.challengeModel().startDate;
    const end = this.challengeModel().endDate;
    if (!start || !end) return false;
    return new Date(end) <= new Date(start);
  });

  public isSubmitDisabled = computed(() => {
    return (
      this.challengeForm().invalid() ||
      this.isDateRangeInvalid() ||
      this.isSubmitting()
    );
  });

  public applyPreset(days: number) {
    const currentStart = this.challengeModel().startDate || this.getDefaultStartDate();
    const start = new Date(currentStart);
    start.setDate(start.getDate() + days);
    const newEnd = start.toISOString().split('T')[0];
    this.challengeModel.update((m) => ({
      ...m,
      endDate: newEnd,
    }));
  }

  public submit() {
    if (this.isSubmitDisabled()) return;

    const val = this.challengeForm().value();
    this.isSubmitting.set(true);

    if (this.isEdit && this.data.challenge?.id) {
      this.challengeHelper.updateChallenge(this.data.challenge.id, val).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.dialogRef.close(res);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error('Error al actualizar el reto:', err);
        },
      });
    } else {
      this.challengeHelper.createChallenge(val).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.dialogRef.close(res);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error('Error al crear el reto:', err);
        },
      });
    }
  }

  public close() {
    this.dialogRef.close();
  }
}
