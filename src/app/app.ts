import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemePicker } from './core/logic/theme-picker';
import { UpdateAlert } from './features/dashboard/update-alert/update-alert';
import { RitualHelper } from './features/rituals/logic/ritual-helper';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UpdateAlert],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('sopro');
  private theme = inject(ThemePicker);
  private ritualHelper = inject(RitualHelper);

  ngOnInit() {
    // 1. Auditoría inicial al cargar la aplicación por primera vez
    this.ritualHelper.verificarExpiracion();

    // 2. El Sistema de Vigilancia Constante
    // Escucha cada vez que la PWA vuelve a estar visible en la pantalla
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // El usuario volvió a abrir la app. Evaluamos si cruzó la medianoche.
        this.ritualHelper.verificarExpiracion();
      }
    });
  }
}
