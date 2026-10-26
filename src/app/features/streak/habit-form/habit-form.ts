import { Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { DomainWithHabitCount } from '../logic/Domain';
import { HabitHTTP } from '../logic/habit-http';
import { DomainHTTP } from '../logic/domain-http';
import { FormsModule } from '@angular/forms';

interface HabitFormModel {
  name: string;
  frequency: string;
  domainId: string;
}

@Component({
  selector: 'app-habit-form',
  imports: [FormField,FormsModule],
  templateUrl: './habit-form.html',
  styleUrl: './habit-form.scss',
})
export class HabitForm implements OnInit {
  private habitService = inject(HabitHTTP);
  private domainService = inject(DomainHTTP);
  private dialogRef = inject(MatDialogRef<HabitForm>, { optional: true });

  public domains = signal<DomainWithHabitCount[]>([]);
  public isSubmitting = signal(false);

  public habitModel = signal<HabitFormModel>({
    name: '',
    frequency: 'daily',
    domainId: '',
  });

  public habitForm = form(this.habitModel, (h) => {
    required(h.name, { message: 'El nombre del hábito es obligatorio.' });
    required(h.frequency, { message: 'La frecuencia es obligatoria.' });
  });

  ngOnInit() {
    this.domainService.listDomains().subscribe({
      next: (res) => this.domains.set(res || []),
      error: (err: unknown) => console.error('Error al listar dominios:', err),
    });
  }

  submit() {
    if (this.habitForm().invalid() || this.isSubmitting()) {
      return;
    }

    const payload = this.habitForm().value();
    this.isSubmitting.set(true);

    this.habitService.createHabit(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.dialogRef?.close(res);
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Error al crear hábito:', err);
      },
    });
  }
}
