import { Component, effect, inject, signal } from '@angular/core';
import { FormField, form, required, pattern, applyEach } from '@angular/forms/signals';
import { RitualHttp } from '../logic/ritual-http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DailyRitual } from '../logic/DailyRitual';
import { RitualHelper } from '../logic/ritual-helper';

@Component({
  selector: 'app-ritual-form',
  imports: [FormsModule, FormField],
  templateUrl: './ritual-form.html',
  styleUrl: './ritual-form.scss',
})
export class RitualForm {

private service = inject(RitualHttp); 
private ritualHelper = inject(RitualHelper);
private router = inject(Router);

constructor() {
 effect(() => {
    if(this.ritualHelper.showTodaysRitual()) {
      this.router.navigate(['/home']); 
    }
  }); 
}
actualizarMeta(index: number, nuevoValor: string) {
  this.ritual.update((estadoActual) => {
    const nuevasMetas = [...estadoActual.goals];
    
    nuevasMetas[index] = nuevoValor;
    
    return {
      ...estadoActual,
      goals: nuevasMetas
    };
  });
}
ritual = signal<DailyRitual>({
  grateful_for:"",
  goals: Array(10).fill(''),
  user_id:''
})
private readonly validRegex = /^[a-zA-Z0-9\s%áéíóúÁÉÍÓÚñÑ]+$/;
public ritualForm = form(this.ritual, (ritual) => {
    
    required(ritual.grateful_for);
    pattern(ritual.grateful_for, this.validRegex);

    applyEach(ritual.goals, (goalItem) => {
      required(goalItem);
      pattern(goalItem, this.validRegex);
    });
  });
  onSubmit(): void {

    if (this.ritualForm().invalid()) {
      return;
    }
      const ritualData = this.ritualForm().value();
      this.service.saveRitual(ritualData).subscribe({
        next: () => {
          this.router.navigate(['streak'])
        },
        error: (err: unknown) => { 
          console.error('El fracaso es temporal. Hubo un error al registrar el ritual:', err);
        }
      });
  }


}
