import { Component, computed, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-view',
  imports: [RouterModule, MatTabsModule, MatButtonModule, MatIconModule, RouterOutlet],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
private router = inject(Router);
  private route = inject(ActivatedRoute); // <-- Inyectamos la ruta activa

  // 1. Corrección: Usar urlAfterRedirects y startWith para detectar la redirección inicial
  activeTabIndex: Signal<number> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.getTabIndex(event.urlAfterRedirects)),
      startWith(this.getTabIndex(this.router.url)) // Asegura que lea la ruta al recargar la página
    ),
    { initialValue: 0 }
  );

  fabIcon: Signal<string> = computed(() => {
    switch(this.activeTabIndex()) {
      case 0: return 'add_task';
      case 1: return 'category';
      case 2: return 'emoji_events';
      case 3: return 'hub';
      default: return 'add';
    }
  });

  // Método auxiliar para evitar hardcodear la ruta padre
  private getTabIndex(url: string): number {
    if (url.includes('domains')) return 1;
    if (url.includes('trophies')) return 2;
    if (url.includes('compound-trophies')) return 3;
    return 0; // 'habitos' por defecto
  }

  onTabChange(event: any) {
    const childRoutes = ['habits', 'domains', 'trophies', 'compound-trophies'];
    
    // 2. Corrección: Usar navegación RELATIVA. 
    // De esta forma, sin importar si tu ruta padre es /streak, /steaks o /rachas, 
    // Angular sabrá concatenar el hijo correctamente sin romper la redirección.
    this.router.navigate([childRoutes[event.index]], { relativeTo: this.route });
  }

  ejecutarAccionPrincipal() {
    console.log('Acción FAB en pestaña:', this.activeTabIndex());
  }
  public isFabMenuOpen = signal<boolean>(false);

  public toggleFabMenu(): void {
    this.isFabMenuOpen.update(v => !v);
  }

  // Ejemplo de acciones
  public ejecutarAccion(tipo: string): void {
    console.log('Ejecutando acción:', tipo);
    this.isFabMenuOpen.set(false); // Cierra el menú tras elegir
  }
}
