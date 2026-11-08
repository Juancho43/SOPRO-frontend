import { Component, inject, signal, OnInit } from '@angular/core';
import { FormField, form, required, minLength } from '@angular/forms/signals';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomainHTTP } from '../logic/domain-http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomainWithHabitCount } from '../logic/Domain';

export interface DomainModalData {
  mode: 'create' | 'edit';
  domain?: DomainWithHabitCount;
}

interface DomainFormModel {
  name: string;
  colorHex: string;
}

@Component({
  selector: 'app-domain-form',
  standalone: true,
  imports: [CommonModule, FormField, FormsModule],
  templateUrl: './domain-form.html',
  styleUrl: './domain-form.scss',
})
export class DomainForm implements OnInit {
  private domainService = inject(DomainHTTP);
  public dialogRef = inject(MatDialogRef<DomainForm>, { optional: true });
  public data: DomainModalData = inject(MAT_DIALOG_DATA, { optional: true }) || { mode: 'create' };

  public isEdit = signal<boolean>(false);
  public isSubmitting = signal<boolean>(false);
  public isDeleting = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public domainModel = signal<DomainFormModel>({
    name: '',
    colorHex: '#4759A8',
  });

  public domainForm = form(this.domainModel, (d) => {
    required(d.name, { message: 'El nombre del dominio es obligatorio.' });
    minLength(d.name, 3, { message: 'El nombre debe tener al menos 3 caracteres.' });
    required(d.colorHex, { message: 'El color es obligatorio.' });
  });

  ngOnInit() {
    if (this.data?.mode === 'edit' && this.data.domain) {
      this.isEdit.set(true);
      this.domainModel.set({
        name: this.data.domain.name,
        colorHex: this.data.domain.colorHex || '#4759A8',
      });
    }
  }

  submit() {
    if (this.domainForm().invalid() || this.isSubmitting() || this.isDeleting()) {
      return;
    }

    const payload = this.domainForm().value();
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    if (this.isEdit() && this.data.domain) {
      this.domainService.updateDomain(this.data.domain.id, payload).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.dialogRef?.close({ updated: true, domain: { ...this.data.domain, ...payload } });
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          const errorMsg = (err as any)?.error?.error || 'Error al actualizar el dominio.';
          this.errorMessage.set(errorMsg);
          console.error('Error al actualizar dominio:', err);
        },
      });
    } else {
      this.domainService.createDomain(payload).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.dialogRef?.close(res);
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          const errorMsg = (err as any)?.error?.error || 'Error al crear el dominio.';
          this.errorMessage.set(errorMsg);
          console.error('Error al crear dominio:', err);
        },
      });
    }
  }

  deleteDomain() {
    if (!this.isEdit() || !this.data.domain || this.isDeleting() || this.isSubmitting()) {
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar el dominio "${this.data.domain.name}"? Los hábitos vinculados se mantendrán.`)) {
      return;
    }

    this.isDeleting.set(true);
    this.errorMessage.set(null);

    this.domainService.deleteDomain(this.data.domain.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.dialogRef?.close({ deleted: true, domainId: this.data.domain!.id });
      },
      error: (err: unknown) => {
        this.isDeleting.set(false);
        const errorMsg = (err as any)?.error?.error || 'Error al eliminar el dominio.';
        this.errorMessage.set(errorMsg);
        console.error('Error al eliminar dominio:', err);
      },
    });
  }

  close() {
    this.dialogRef?.close();
  }
}
