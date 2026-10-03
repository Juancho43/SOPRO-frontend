import { DOCUMENT, Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemePicker {
  private document = inject(DOCUMENT);
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  
  protected isDarkMode = false;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      this.isDarkMode = true;
      this.setTheme('dark');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.setTheme(this.isDarkMode ? 'dark' : 'light');
  }

  private setTheme(theme: string) {
    if (theme === 'dark') {
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(this.document.documentElement, 'data-theme');
    }
  }
}