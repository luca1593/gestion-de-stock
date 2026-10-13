import { Component, HostListener, ElementRef } from '@angular/core';
import { ConfirmationService } from './confirmation.service';

/**
 * Boite de confirmation unique, montee dans le shell (le composant qui
 * enveloppe toutes les pages). Tous les appels a ConfirmationService.vider()
 * aboutissent ici, quel que soit l'ecran d'origine.
 *
 * Elle est ecrite sans dependance a Bootstrap : le declic dehors, la touche
 * Echap et le bouton retour arriere se comportent comme attendu partout, y
 * compris dans les iframes et hors des contextes ou le bundle Bootstrap
 * n'est pas charge.
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  readonly titreId = 'confirm-titre';
  readonly messageId = 'confirm-message';

  constructor(
    public confirmation: ConfirmationService,
    private host: ElementRef<HTMLElement>
  ) { }

  /**
   * Le fond se ferme sur mousedown, et non sur un clic ecoute au niveau du
   * document. Un ecouteur document:click annulait la boite qu'il venait
   * d'ouvrir : le clic remonte d'abord au bouton (qui ouvre la boite), puis
   * au document (qui la referme dans le meme evenement). La suppression ne
   * partait donc jamais, sans le moindre message.
   */
  @HostListener('document:mousedown', ['$event'])
  onAppuiFond(event: MouseEvent): void {
    if (!this.confirmation.etat.visible) return;
    // le fond fait partie du composant : c'est la carte seule qui protege
    // l'utilisateur d'un clic accidentel sur son message
    const carte = this.host.nativeElement.querySelector('.confirm-dialog');
    if (carte && carte.contains(event.target as Node)) return;
    this.confirmation.annuler();
  }

  /** Echap annule. */
  @HostListener('document:keydown.escape', ['$event'])
  onEchap(event: KeyboardEvent): void {
    if (!this.confirmation.etat.visible) return;
    event.preventDefault();
    this.confirmation.annuler();
  }

  /**
   * Piège de focus : tant que la boite est ouverte, Tab et Maj+Tab
   * restent sur ses deux boutons. Sans cela, la tabulation continuait
   * derrière la boite, dans la page masquee.
   */
  @HostListener('document:keydown', ['$event'])
  onTabulation(event: KeyboardEvent): void {
    if (!this.confirmation.etat.visible || event.key !== 'Tab') return;

    const boutons = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLButtonElement>('.confirm-actions button')
    ).filter(b => !b.disabled);

    if (!boutons.length) return;

    const premier = boutons[0];
    const dernier = boutons[boutons.length - 1];
    const actif = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (actif === premier || !this.host.nativeElement.contains(actif)) {
        event.preventDefault();
        dernier.focus();
      }
    } else if (actif === dernier || !this.host.nativeElement.contains(actif)) {
      event.preventDefault();
      premier.focus();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.confirmation.etat.visible) return;
    // le bouton de validation reçoit le focus : l'utilisateur valide ou
    // echappe sans avoir a Souris, et unifier accidentel sur la suppression
    // ne peut plus se produire
    const validation = this.host.nativeElement.querySelector<HTMLButtonElement>('.btn-danger, .btn-primary');
    if (validation && document.activeElement !== validation) {
      validation.focus();
    }
  }
}