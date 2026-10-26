import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RadarAxis {
  label: string;
  value: number; // 0 a 100
  color: string;
}

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="radar-wrapper">
      <svg [attr.viewBox]="'0 0 ' + size + ' ' + size" class="radar-svg">
        <defs>
          <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Fondo concéntrico -->
        <circle [attr.cx]="center" [attr.cy]="center" [attr.r]="radius" fill="url(#radarCenterGlow)" />

        <!-- Círculos concéntricos guía -->
        @for (level of gridLevels; track level) {
          <polygon 
            [attr.points]="getPolygonPoints(radius * level)" 
            class="radar-grid-line" />
        }

        <!-- Ejes radiales -->
        @for (axis of axesWithCoordinates(); track axis.label) {
          <line 
            [attr.x1]="center" 
            [attr.y1]="center" 
            [attr.x2]="axis.xMax" 
            [attr.y2]="axis.yMax" 
            class="radar-axis-line" />
        }

        <!-- Polígono del usuario -->
        @if (dataPointsString()) {
          <polygon 
            [attr.points]="dataPointsString()" 
            class="radar-data-polygon" />
        }

        <!-- Nodos de datos en cada vértice -->
        @for (pt of dataNodes(); track pt.label) {
          <circle 
            [attr.cx]="pt.x" 
            [attr.cy]="pt.y" 
            r="4" 
            [attr.fill]="pt.color" 
            class="radar-node-point" />
        }

        <!-- Etiquetas de texto -->
        @for (axis of axesWithCoordinates(); track axis.label) {
          <text 
            [attr.x]="axis.xText" 
            [attr.y]="axis.yText" 
            text-anchor="middle" 
            dominant-baseline="central" 
            class="radar-label">
            {{ axis.label }}
          </text>
        }
      </svg>
    </div>
  `,
  styles: [`
    .radar-wrapper {
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .radar-svg {
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .radar-grid-line {
      fill: none;
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 1;
    }

    .radar-axis-line {
      stroke: rgba(255, 255, 255, 0.08);
      stroke-dasharray: 2, 2;
    }

    .radar-data-polygon {
      fill: rgba(255, 128, 0, 0.2);
      stroke: #ff9100;
      stroke-width: 2.5;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 8px rgba(255, 145, 0, 0.5));
      transition: all 0.5s ease;
    }

    .radar-node-point {
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
    }

    .radar-label {
      fill: #a1a1aa;
      font-size: 10px;
      font-weight: 500;
      font-family: inherit;
    }
  `]
})
export class RadarChartComponent {
  axes = input<RadarAxis[]>([]);

  readonly size = 280;
  readonly center = 140;
  readonly radius = 95;
  readonly gridLevels = [0.25, 0.5, 0.75, 1.0];

  axesWithCoordinates = computed(() => {
    const list = this.axes();
    const count = list.length || 3;
    const angleStep = (2 * Math.PI) / count;

    return list.map((item, idx) => {
      // Iniciar desde arriba (- PI/2)
      const angle = idx * angleStep - Math.PI / 2;
      const xMax = this.center + this.radius * Math.cos(angle);
      const yMax = this.center + this.radius * Math.sin(angle);

      // Posición de la etiqueta un poco más alejada
      const labelDistance = this.radius + 24;
      const xText = this.center + labelDistance * Math.cos(angle);
      const yText = this.center + labelDistance * Math.sin(angle);

      return {
        ...item,
        angle,
        xMax,
        yMax,
        xText,
        yText
      };
    });
  });

  dataNodes = computed(() => {
    return this.axesWithCoordinates().map((item) => {
      const val = Math.max(10, Math.min(100, item.value));
      const r = (val / 100) * this.radius;
      const x = this.center + r * Math.cos(item.angle);
      const y = this.center + r * Math.sin(item.angle);

      return {
        label: item.label,
        color: item.color || '#ff9100',
        x,
        y
      };
    });
  });

  dataPointsString = computed(() => {
    const nodes = this.dataNodes();
    if (nodes.length === 0) return '';
    return nodes.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ');
  });

  getPolygonPoints(r: number): string {
    const count = this.axes().length || 5;
    const angleStep = (2 * Math.PI) / count;
    const points: string[] = [];

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = this.center + r * Math.cos(angle);
      const y = this.center + r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return points.join(' ');
  }
}
