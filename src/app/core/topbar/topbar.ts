import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // La señal reactiva que controla el título visible
  public currentTitle = signal<string>('Inicio');

  // Mapeo estratégico: Ruta -> Nombre de la Familia
  private routeMap: Record<string, string> = {
    '/home': 'Inicio',
    '/streaks': 'Rachas',
    '/finances': 'Finanzas',
    '/rituals': 'Roadmap',
    '/menu': 'Menu'
  };

  constructor() {
    // 1. Establecer el título inicial al cargar la app
    this.updateTitle(this.router.url);

    // 2. Escuchar la brújula de navegación para actualizar el título
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event) => {
      this.updateTitle(event.urlAfterRedirects);
    });
  }

  private updateTitle(url: string) {
    // Extraemos la ruta base, ignorando parámetros extra (ej: /home?user=123)
    const basePath = url.split('?')[0];
    const newTitle = this.routeMap[basePath] || 'SOPRO'; 
    this.currentTitle.set(newTitle);
  }
}
