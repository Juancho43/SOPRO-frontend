import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemePicker } from './core/logic/theme-picker';
import { UpdateAlert } from './features/dashboard/update-alert/update-alert';
import { Navbar } from './core/navbar/navbar';
import { Topbar } from './core/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UpdateAlert, Navbar, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sopro');
  private theme = inject(ThemePicker);
 
}
