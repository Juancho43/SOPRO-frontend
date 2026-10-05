import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


interface DayStatus {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
}
@Component({
  selector: 'app-streak-celebration',
  imports: [RouterLink],
  templateUrl: './streak-celebration.html',
  styleUrl: './streak-celebration.scss',
})
export class StreakCelebration {
streakCount: number = 32;
  hoursLeft: number = 13;

  // El mapa de progreso semanal
  weekDays: DayStatus[] = [
    { name: 'Do', status: 'completed' },
    { name: 'Lu', status: 'completed' },
    { name: 'Ma', status: 'current' },
    { name: 'Mi', status: 'completed' },
    { name: 'Ju', status: 'completed' },
    { name: 'Vi', status: 'completed' },
    { name: 'Sa', status: 'completed' },
  ];

  continue() {
    // Acción para avanzar al siguiente objetivo
    console.log('Disciplina forjada. Avanzando...');
  }
}
