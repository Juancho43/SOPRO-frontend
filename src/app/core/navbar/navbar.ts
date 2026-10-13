import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
 private router = inject(Router);
 protected currentTab = 'inicio';
  tabs = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'rituals', label: 'Calendario', icon: 'calendar_today' },
    { id: 'streaks', label: 'Rachas', icon: 'local_fire_department' },
    { id: 'finances', label: 'Finanzas', icon: 'wallet' },
    { id: 'menu', label: 'Menu', icon: 'menu' }
  ];

  selectTab(tabId: string) {
    this.currentTab = tabId;
    this.router.navigate([`/${tabId}`]);
  }
}
