import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainHTTP } from '../logic/domain-http';
import { DomainWithHabitCount, DomainEffortPoint } from '../logic/Domain';
import { RadarChartComponent, RadarAxis } from './radar-chart.component';

@Component({
  selector: 'app-domains-view',
  standalone: true,
  imports: [CommonModule, RadarChartComponent],
  templateUrl: './domains-view.html',
  styleUrl: './domains-view.scss',
})
export class DomainsView implements OnInit {
  private domainHttp = inject(DomainHTTP);

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
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar dominios:', err);
        this.loading.set(false);
      }
    });
  }

  toggleDomainSelection(id: string) {
    this.selectedDomainId.update((current) => (current === id ? null : id));
  }

  radarAxes = computed<RadarAxis[]>(() => {
    const doms = this.domains();
    const metrics = this.radarMetrics();

    // Mapeamos los puntos de esfuerzo acumulado por domainId
    const effortByDomain: Record<string, number> = {};
    metrics.forEach((m) => {
      effortByDomain[m.domainId] = (effortByDomain[m.domainId] || 0) + m.effortValue;
    });

    if (doms.length === 0) return [];

    return doms.map((d) => {
      // Normalizamos el valor de esfuerzo entre 20 y 95 para una visualización armónica
      const rawEffort = effortByDomain[d.id] || (d.habitCount > 0 ? 60 : 30);
      const score = Math.min(Math.max(rawEffort, 20), 100);

      return {
        label: d.name,
        value: score,
        color: d.colorHex || '#ff9100'
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
