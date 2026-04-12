import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteContextService {
  private currentContextSubject = new BehaviorSubject<string>('');
  currentContext$ = this.currentContextSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.updateContext(url);
    });

    this.updateContext(this.router.url);
  }

  private updateContext(url: string): void {
    let context = '';

    if (url.includes('/articles')) {
      context = 'articles';
    } else if (url.includes('/clients')) {
      context = 'clients';
    } else if (url.includes('/fournisseurs')) {
      context = 'fournisseurs';
    } else if (url.includes('/categories')) {
      context = 'categories';
    } else if (url.includes('/utilisateurs')) {
      context = 'utilisateurs';
    } else if (url.includes('/vente')) {
      context = 'vente';
    } else if (url.includes('/commande-client')) {
      context = 'commande-client';
    } else if (url.includes('/commande-fournisseur')) {
      context = 'commande-fournisseur';
    } else if (url.includes('/mvtstk')) {
      context = 'mvtstk';
    } else {
      context = '';
    }

    this.currentContextSubject.next(context);
  }

  getCurrentContext(): string {
    return this.currentContextSubject.value;
  }
}
