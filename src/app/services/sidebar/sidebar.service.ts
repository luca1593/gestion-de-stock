import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Etat d'ouverture du menu lateral (sidebar).
 *
 * Sert a faire communiquer le bouton hamburger du header avec la sidebar
 * du shell dashboard : les deux sont des composants freres, sans lien
 * parent/enfant direct.
 */
@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isOpen$ = new BehaviorSubject<boolean>(false);
  readonly open$ = this.isOpen$.asObservable();

  get isOpen(): boolean {
    return this.isOpen$.value;
  }

  open(): void {
    this.isOpen$.next(true);
  }

  close(): void {
    this.isOpen$.next(false);
  }

  toggle(): void {
    this.isOpen$.next(!this.isOpen$.value);
  }
}
