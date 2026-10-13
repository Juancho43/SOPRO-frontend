import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { UpdateAlert } from '../../features/dashboard/update-alert/update-alert';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, UpdateAlert, Topbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
