import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
// El estado inicial: la página donde comienzan los ganadores
  currentTab = 'inicio';

  // Tu mapa de navegación hacia el éxito
  tabs = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'rachas', label: 'Rachas', icon: 'local_fire_department' },
    { id: 'metas', label: 'Metas', icon: 'flag' },
    { id: 'calendario', label: 'Calendario', icon: 'calendar_today' },
    { id: 'cuenta', label: 'Cuenta', icon: 'person' }
  ];

  selectTab(tabId: string) {
    this.currentTab = tabId;
    // NOTA PARA LA ACCIÓN: Aquí inyectarás el Router de Angular
    // para navegar a las distintas rutas de tu aplicación.
  }
}
