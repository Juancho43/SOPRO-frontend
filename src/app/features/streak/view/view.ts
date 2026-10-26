import { Component, computed, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogHelper } from '../../../core/helpers/dialog-helper';
import { DomainForm } from '../domain-form/domain-form';
import { TrophyForm } from '../trophy-form/trophy-form';
import { HabitForm } from '../habit-form/habit-form';
import { CompoundTrophyForm } from '../compound-trophy-form/compound-trophy-form';
import { ComponentType } from '@angular/cdk/portal';
@Component({
  selector: 'app-view',
  imports: [RouterModule, MatTabsModule, MatButtonModule, MatIconModule, RouterOutlet],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private helper = inject(DialogHelper);
  activeTabIndex: Signal<number> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.getTabIndex(event.urlAfterRedirects)),
      startWith(this.getTabIndex(this.router.url)) 
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

  private getTabIndex(url: string): number {
    if (url.includes('domains')) return 1;
    if (url.includes('trophies')) return 2;
    if (url.includes('compound-trophies')) return 3;
    return 0;  
   }

  onTabChange(event: any) {
    const childRoutes = ['habits', 'domains', 'trophies', 'compound-trophies'];
    
    this.router.navigate([childRoutes[event.index]], { relativeTo: this.route });
  }

  ejecutarAccionPrincipal() {
    console.log('Acción FAB en pestaña:', this.activeTabIndex());
  }
  public isFabMenuOpen = signal<boolean>(false);

  public toggleFabMenu(): void {
    this.isFabMenuOpen.update(v => !v);
  }

ejecutarAccion(tipo: string): void {
    this.isFabMenuOpen.set(false);

    switch (tipo) {
      case 'dominio':
        this.openForm(DomainForm);
        break;
      case 'habito':
        this.openForm(HabitForm);
        break;
      case 'trofeo':
        this.openForm(TrophyForm);
        break;
      case 'sinergia': 
        this.openForm(CompoundTrophyForm);
        break;
      default:
        console.warn('Acción de FAB no reconocida:', tipo);
    }
  }

  /**
   * Abstrae la lógica repetitiva de abrir un modal y escuchar su cierre.
   * Acepta cualquier componente de Angular.
   */
  private openForm<T>(component: ComponentType<T>): void {
    const dialogRef = this.helper.open(component, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`[${component.name}] Operación exitosa:`, result);
      } else {
        console.log(`[${component.name}] El usuario canceló la operación.`);
      }
    });
  }
}
