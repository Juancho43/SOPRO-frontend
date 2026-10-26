import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, minLength } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { DomainHTTP } from '../logic/domain-http';
import { FormsModule } from '@angular/forms';

interface DomainFormModel {
  name: string;
  colorHex: string;
}

@Component({
  selector: 'app-domain-form',
  imports: [FormField,FormsModule],
  templateUrl: './domain-form.html',
  styleUrl: './domain-form.scss',
})
export class DomainForm {
  private domainService = inject(DomainHTTP);
  private dialogRef = inject(MatDialogRef<DomainForm>, { optional: true });

  public isSubmitting = signal(false);

  public domainModel = signal<DomainFormModel>({
    name: '',
    colorHex: '#4759A8',
  });

  public domainForm = form(this.domainModel, (d) => {
    required(d.name, { message: 'El nombre del dominio es obligatorio.' });
    minLength(d.name, 3, { message: 'El nombre debe tener al menos 3 caracteres.' });
    required(d.colorHex, { message: 'El color es obligatorio.' });
  });

  submit() {
    if (this.domainForm().invalid() || this.isSubmitting()) {
      return;
    }

    const payload = this.domainForm().value();
    this.isSubmitting.set(true);

    this.domainService.createDomain(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.dialogRef?.close(res);
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Error al crear dominio:', err);
      },
    });
  }
}
