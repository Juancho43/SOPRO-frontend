import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DomainHTTP } from '../logic/domain-http';
import { DomainWithHabitCount, DomainEffortPoint } from '../logic/Domain';
import { RadarChartComponent, RadarAxis } from './radar-chart.component';
import { DomainForm } from '../domain-form/domain-form';

@Component({
  selector: 'app-domains-view',
  standalone: true,
  imports: [CommonModule, RadarChartComponent],
  templateUrl: './domains-view.html',
  styleUrl: './domains-view.scss',
})
export class DomainsView implements OnInit {
  private domainHttp = inject(DomainHTTP);
  private dialog = inject(MatDialog);

  domains = signal<DomainWithHabitCount[]>([]);
  radarMetrics = signal<DomainEffortPoint[]>([]);
  loading = signal<boolean>(true);
  selectedDomainId = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.domainHttp.listDomains().subscribe({
      next: (doms) => {
        this.domains.set(doms || []);
        this.domainHttp.getRadarMetrics().subscribe({
          next: (metrics) => {
            this.radarMetrics.set(metrics || []);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error al cargar radar metrics:', err);
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar dominios:', err);
        this.loading.set(false);
      },
    });
  }

  openCreateDomainModal() {
    const dialogRef = this.dialog.open(DomainForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '380px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  openEditDomainModal(dom: DomainWithHabitCount) {
    this.selectedDomainId.set(dom.id);
    const dialogRef = this.dialog.open(DomainForm, {
      panelClass: 'modal-transparente',
      maxWidth: '92vw',
      width: '380px',
      data: {
        mode: 'edit',
        domain: dom,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted || result?.updated || result) {
        this.loadData();
      }
    });
  }

  radarAxes = computed<RadarAxis[]>(() => {
    const doms = this.domains();
    const metrics = this.radarMetrics();

    // Mapeamos los puntos de esfuerzo acumulado por domainId
    const effortByDomain: Record<string, number> = {};
    metrics.forEach((m) => {
      const id = m.domainId || m.domain_id;
      const score = Number(m.effortScore ?? m.effort_score ?? m.effortValue ?? 0);
      if (id) {
        effortByDomain[id] = score;
      }
    });

    if (doms.length === 0) return [];

    return doms.map((d) => {
      const habitCount = Number(d.habitCount ?? d.habit_count ?? 0);
      const rawEffort = effortByDomain[d.id] ?? (habitCount > 0 ? 50 : 20);
      const score = Math.min(Math.max(rawEffort, 15), 100);

      return {
        label: d.name,
        value: score,
        color: d.colorHex || d.color || '#ff9100',
      };
    });
  });

  averageScore = computed(() => {
    const axes = this.radarAxes();
    if (axes.length === 0) return 85; // default representativo del diseño si no hay data
    const sum = axes.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / axes.length);
  });
}
