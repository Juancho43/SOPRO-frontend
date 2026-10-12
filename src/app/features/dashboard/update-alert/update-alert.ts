import { Component, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-update-alert',
  imports: [],
  templateUrl: './update-alert.html',
  styleUrl: './update-alert.scss',
})
export class UpdateAlert {
  private swUpdate = inject(SwUpdate);
  
  // Bandera para mostrar u ocultar el mensaje
  public updateAvailable = false;

  ngOnInit() {
    // 1. Verificamos que el Service Worker esté habilitado en el entorno
    if (this.swUpdate.isEnabled) {
      
      // 2. Escuchamos específicamente el evento 'VERSION_READY'
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          // Una nueva versión se ha descargado en caché y está lista
          this.updateAvailable = true;
        });
    }
  }

  forceReload() {
    // 3. Le decimos al Service Worker que tome el control inmediato con la nueva versión
    this.swUpdate.activateUpdate().then(() => {
      // 4. Recargamos la pestaña limpiamente.
      // Al haber activado el update, la recarga traerá los archivos frescos, no los del caché antiguo.
      document.location.reload();
    });
  }
}
