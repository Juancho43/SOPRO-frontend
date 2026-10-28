import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, required, maxLength } from '@angular/forms/signals';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChallengeHelper } from '../logic/challenge-helper';

interface MilestoneFormModel {
  title: string;
  dueDate: string;
}

@Component({
  selector: 'app-milestone-form',
  imports: [FormField],
  templateUrl: './milestone-form.component.html',
  styleUrl: './milestone-form.component.scss',
})
export class MilestoneFormComponent {
  private dialogRef = inject(MatDialogRef<MilestoneFormComponent>);
  private challengeHelper = inject(ChallengeHelper);
  public data: { challengeId: string; minDate?: string; maxDate?: string } =
    inject(MAT_DIALOG_DATA);

  public isSubmitting = signal(false);

  public milestoneModel = signal<MilestoneFormModel>({
    title: '',
    dueDate: this.data.minDate || new Date().toISOString().split('T')[0],
  });

  public milestoneForm = form(this.milestoneModel, (p) => {
    required(p.title, { message: 'El título del hito es obligatorio.' });
    maxLength(p.title, 120, { message: 'El título no puede exceder 120 caracteres.' });
    required(p.dueDate, { message: 'La fecha límite es obligatoria.' });
  });

  public isDueDateOutOfRange = computed(() => {
    const dueStr = this.milestoneModel().dueDate;
    if (!dueStr) return false;
    const due = new Date(dueStr);
    if (this.data.minDate && due < new Date(this.data.minDate)) return true;
    if (this.data.maxDate && due > new Date(this.data.maxDate)) return true;
    return false;
  });

  public isSubmitDisabled = computed(() => {
    return (
      this.milestoneForm().invalid() ||
      this.isDueDateOutOfRange() ||
      this.isSubmitting()
    );
  });

  public submit() {
    if (this.isSubmitDisabled()) return;

    const val = this.milestoneForm().value();
    this.isSubmitting.set(true);

    this.challengeHelper.addMilestone(this.data.challengeId, val).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error al agregar el hito:', err);
      },
    });
  }

  public close() {
    this.dialogRef.close();
  }
}
