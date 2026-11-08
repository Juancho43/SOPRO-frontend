import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TrophyHTTP } from '../logic/trophy-http';
import { SynergyStatus } from '../logic/Trophy';
import { SynergyTrophyCardComponent, SynergyTrophyModel } from './synergy-trophy-card.component';
import { CompoundTrophyForm } from '../compound-trophy-form/compound-trophy-form';
import { TrophyDetailModalComponent } from '../trophies-view/trophy-detail-modal.component';
import { ShowcaseTrophy } from '../logic/Trophy';

@Component({
  selector: 'app-compound-trophies-view',
  standalone: true,
  imports: [CommonModule, SynergyTrophyCardComponent],
  templateUrl: './compound-trophies-view.html',
  styleUrl: './compound-trophies-view.scss',
})
export class CompoundTrophiesView implements OnInit {
  private trophyHttp = inject(TrophyHTTP);
  private dialog = inject(MatDialog);

  synergies = signal<SynergyTrophyModel[]>([]);
  synergyStatuses = signal<Record<string, SynergyStatus>>({});
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadSynergies();
  }

  loadSynergies() {
    this.loading.set(true);

    // Consultamos GET /api/v1/trophies y filtramos los de sinergia
    this.trophyHttp.listTrophies({ limit: 100 }).subscribe({
      next: (result) => {
        const allTrophies = result?.trophies || [];
        const synergyList: SynergyTrophyModel[] = allTrophies
          .filter(
            (t) =>
              t.isSynergy === true ||
              t.target_type === 'synergy' ||
              (t.conditions && t.conditions.length > 1) ||
              t.conditionType === 'synergy' ||
              t.conditionType === 'compound'
          )
          .map((t) => ({
            id: t.id,
            name: t.name || t.title || 'Sinergia',
            description: t.description,
            rarity: (t.required_streak_days ?? t.targetValue ?? 0) >= 21 ? 'Legendary' : 'Epic',
            icon: t.icon || 'hub',
            requiredStreakDays: t.required_streak_days ?? t.targetValue ?? 15,
          }));

        this.synergies.set(synergyList);
        this.loadStatuses(synergyList);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar trofeos de sinergia:', err);
        this.loading.set(false);
      },
    });
  }

  private loadStatuses(list: SynergyTrophyModel[]) {
    list.forEach((s) => {
      // GET /api/v1/trophies/{id}
      this.trophyHttp.getTrophyDetails(s.id).subscribe({
        next: (status) => {
          this.synergyStatuses.update((cur) => ({
            ...cur,
            [s.id]: status,
          }));
        },
        error: (err) => {
          console.error(`Error al cargar status de sinergia ${s.id}:`, err);
        },
      });
    });
  }

  openCreateCompoundModal() {
    const dialogRef = this.dialog.open(CompoundTrophyForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '380px',
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadSynergies();
      }
    });
  }

  openSynergyDetail(syn: SynergyTrophyModel) {
    const status = this.synergyStatuses()[syn.id];
    const trophyForModal: ShowcaseTrophy = {
      id: syn.id,
      name: syn.name,
      title: syn.name,
      description: syn.description,
      icon: syn.icon || 'hub',
      isSynergy: true,
      target_type: 'synergy',
      required_streak_days: syn.requiredStreakDays,
      unlocked: status?.isCompleted ?? status?.unlocked ?? status?.isUnlocked ?? false,
      isUnlocked: status?.isCompleted ?? status?.unlocked ?? status?.isUnlocked ?? false,
    };

    const dialogRef = this.dialog.open(TrophyDetailModalComponent, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '420px',
      data: {
        trophy: trophyForModal,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted) {
        this.loadSynergies();
      }
    });
  }
}
