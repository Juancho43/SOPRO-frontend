import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TrophyHTTP } from '../logic/trophy-http';
import { SynergyStatus } from '../logic/Trophy';
import { SynergyTrophyCardComponent, SynergyTrophyModel } from './synergy-trophy-card.component';
import { CompoundTrophyForm } from '../compound-trophy-form/compound-trophy-form';

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

    this.trophyHttp.listTrophies().subscribe({
      next: (allTrophies) => {
        // Filtramos aquellos que sean de condición 'synergy'
        const synergyList: SynergyTrophyModel[] = allTrophies
          .filter((t) => t.conditionType === 'synergy' || t.conditionType === 'compound')
          .map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            rarity: t.targetValue >= 21 ? 'Legendary' : 'Epic',
            icon: t.icon,
            requiredStreakDays: t.targetValue || 15
          }));

        this.synergies.set(synergyList);
        this.loadStatuses(synergyList);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar trofeos de sinergia:', err);
        this.loading.set(false);
      }
    });
  }

  private loadStatuses(list: SynergyTrophyModel[]) {
    list.forEach((s) => {
      this.trophyHttp.getSynergyStatus(s.id).subscribe({
        next: (status) => {
          this.synergyStatuses.update((cur) => ({
            ...cur,
            [s.id]: status
          }));
        },
        error: (err) => {
          console.error(`Error al cargar status de sinergia ${s.id}:`, err);
        }
      });
    });
  }

  openCreateCompoundModal() {
    const dialogRef = this.dialog.open(CompoundTrophyForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '380px'
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadSynergies();
      }
    });
  }
}
