import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class DialogHelper {
  private dialog = inject(MatDialog);

  // Configuración maestra: Asegura que el modal respete el diseño Mobile-First M3
  private get baseConfig(): MatDialogConfig {
    return {
      width: 'calc(100% - 32px)', // Margen lateral de 16px en móviles
      maxWidth: '420px',          // Límite innegociable de PWA
      panelClass: 'modal-transparente', // Clase global para limpiar estilos por defecto
      autoFocus: false,           // Evita que el teclado del móvil salte instantáneamente
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '150ms'
    };
  }
/* Abre cualquier componente en un modal respetando las reglas base M3.
   * @param component El componente de Angular a renderizar (ej. HabitFormComponent)
   * @param config Configuración opcional extra (ej. data a inyectar)
   * @returns La referencia del modal para poder suscribirse a su cierre (afterClosed)
   */
  public open<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T> {
    // Fusionamos la configuración base con cualquier configuración extra que pases por parámetro
    const finalConfig = { ...this.baseConfig, ...config };
    
    return this.dialog.open(component, finalConfig);
  }
}
