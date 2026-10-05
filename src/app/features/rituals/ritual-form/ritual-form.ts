import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {form, FormField } from '@angular/forms/signals';
import { RitualHttp } from '../logic/ritual-http';
import { Router } from '@angular/router';
export interface DailyRitual{
  GratefulFor: string;
  Goals: string[];
  User_id: string;
}
@Component({
  selector: 'app-ritual-form',
  imports: [FormsModule, FormField],
  templateUrl: './ritual-form.html',
  styleUrl: './ritual-form.scss',
})
export class RitualForm {

private service = inject(RitualHttp); 
private router = inject(Router);

actualizarMeta(index: number, nuevoValor: string) {
  this.ritual.update((estadoActual) => {
    const nuevasMetas = [...estadoActual.Goals];
    
    nuevasMetas[index] = nuevoValor;
    
    return {
      ...estadoActual,
      Goals: nuevasMetas
    };
  });
}
  // Manejo de estado local utilizando signals puros[cite: 3]
  successMessage = signal<string | null>(null); 
ritual = signal<DailyRitual>({
  GratefulFor:"",
  Goals: Array.from({ length: 10 }, () => ""),
  User_id:''
})
ritualForm = form(this.ritual,(schema)=>{

})

  onSubmit(): void {
    if (this.ritualForm().valid()) {
      const ritualData = this.ritualForm().value();
      this.service.saveRitual(ritualData).subscribe({
        next: () => {
          this.successMessage.set('¡Ritual completado! Tu enfoque está asegurado para hoy.'); //[cite: 2]
          this.router.navigate(['streak'])
        },
        // Evitamos el tipo 'any'; usamos 'unknown' para manejar excepciones de forma segura[cite: 3]
        error: (err: unknown) => { 
          console.error('El fracaso es temporal. Hubo un error al registrar el ritual:', err);
        }
      });
    }
  }


}
