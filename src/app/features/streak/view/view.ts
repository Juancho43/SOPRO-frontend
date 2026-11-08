import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-view',
  imports: [RouterModule, MatTabsModule, RouterOutlet],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTabIndex: Signal<number> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.getTabIndex(event.urlAfterRedirects)),
      startWith(this.getTabIndex(this.router.url))
    ),
    { initialValue: 0 }
  );

  private getTabIndex(url: string): number {
    if (url.includes('domains')) return 1;
    if (url.includes('trophies')) return 2;
    if (url.includes('compound-trophies')) return 3;
    return 0;
  }

  onTabChange(event: { index: number }) {
    const childRoutes = ['habits', 'domains', 'trophies', 'compound-trophies'];
    this.router.navigate([childRoutes[event.index]], { relativeTo: this.route });
  }
}
