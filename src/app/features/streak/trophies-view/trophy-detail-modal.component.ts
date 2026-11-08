import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrophyHTTP } from '../logic/trophy-http';
import { ShowcaseTrophy, SynergyStatus } from '../logic/Trophy';

export interface TrophyDetailDialogData {
  trophy: ShowcaseTrophy;
  currentStreak?: number;
}

@Component({
  selector: 'app-trophy-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trophy-detail-modal.component.html',
  styleUrl: './trophy-detail-modal.component.scss',
})
export class TrophyDetailModalComponent implements OnInit {
  dialogRef = inject(MatDialogRef<TrophyDetailModalComponent>);
  data: TrophyDetailDialogData = inject(MAT_DIALOG_DATA);
  private trophyHttp = inject(TrophyHTTP);

  loading = signal<boolean>(true);
  details = signal<SynergyStatus | null>(null);
  isDeleting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  trophy = computed(() => this.data.trophy);

  isUnlocked = computed(() => {
    const det = this.details();
    if (det !== null) {
      return det.unlocked ?? det.isUnlocked ?? false;
    }
    return this.trophy().unlocked ?? this.trophy().isUnlocked ?? false;
  });

  trophyIcon = computed(() => {
    return this.trophy().icon || 'emoji_events';
  });

  ngOnInit() {
    this.loadDetails();
  }

  loadDetails() {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.trophyHttp.getTrophyDetails(this.trophy().id).subscribe({
      next: (status) => {
        this.details.set(status);
        this.loading.set(false);
      },
      error: (err) => {
        console.warn('No se pudo cargar detalle extendido del trofeo:', err);
        this.loading.set(false);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

  deleteTrophy() {
    if (this.isUnlocked() || this.isDeleting()) return;

    if (!confirm('¿Estás seguro de que deseas eliminar este trofeo?')) {
      return;
    }

    this.isDeleting.set(true);
    this.errorMessage.set(null);

    this.trophyHttp.deleteTrophy(this.trophy().id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.dialogRef.close({ deleted: true, trophyId: this.trophy().id });
      },
      error: (err) => {
        this.isDeleting.set(false);
        const msg = err?.error?.error || 'Error al eliminar el trofeo';
        this.errorMessage.set(msg);
      },
    });
  }
}
