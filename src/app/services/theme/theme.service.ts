import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme='light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme=new BehaviorSubject<Theme>(this.getStoredTheme());
  theme$=this.currentTheme.asObservable();
  darkModeChange$=new BehaviorSubject<boolean>(this.isDarkMode());

  constructor() {
    this.applyTheme(this.currentTheme.value);
  }

  private getStoredTheme(): Theme {
    const stored=localStorage.getItem('app-theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleTheme(): void {
    const newTheme=this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    localStorage.setItem('app-theme', theme);
    this.currentTheme.next(theme);
    this.darkModeChange$.next(theme === 'dark');
    this.applyTheme(theme);
  }

  get currentThemeValue(): Theme {
    return this.currentTheme.value;
  }

  isDarkMode(): boolean {
    return this.currentTheme.value === 'dark';
  }

  getTheme(): Theme {
    return this.currentTheme.value;
  }

  getDarkModeValue(): boolean {
    return this.isDarkMode();
  }
}