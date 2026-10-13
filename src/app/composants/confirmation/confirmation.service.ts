import { Injectable } from '@angular/core';

/**
 * Options d'une demande de confirmation.
 *
 * Tous les sites ne demandent pas la meme chose : l'un supprime un article,
 * l'autre une commande. On garde donc un seul composant capable de porter un
 * message propre a chaque cas, plutot que douze modales divergeantes ou
 * douze confirm() du navigateur.
 */
export interface ConfirmationOptions {
  /** Titre de la boite. Par defaut « Confirmation ». */
  titre?: string;
  /** Phrase principale, ex. « Voulez-vous supprimer cet article ? ». */
  message: string;
  /** Nom de l'element concerne, affiche en evidence sous le message. */
  element?: string | null;
  /** Ce que perd l'utilisateur, si la suppression a des effets. */
  consequence?: string | null;
  /** Libelle du bouton de validation. Par defaut « Supprimer ». */
  confirmLabel?: string;
  /** Libelle du bouton d'abandon. Par defaut « Annuler ». */
  cancelLabel?: string;
  /** false pour une confirmation neutre (fermer sans risque). */
  danger?: boolean;
  /** Classe d'icone FontAwesome. Par defaut triangle d'avertissement. */
  icone?: string;
}

export interface ConfirmationEtat extends ConfirmationOptions {
  visible: boolean;
}

/**
 * Service unique : une seule boite pour toute l'application.
 *
 * L'appel se fait comme une promesse, ce qui evite de sardiner dans chaque
 * page un attribut « id a supprimer », une variable « le dialogue est-il
 * ouvert » et deux methodes.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmationService {

  etat: ConfirmationEtat = this.etatVide();

  private resoluteur: ((valider: boolean) => void) | null = null;

  /**
   * Demande une confirmation et resout true si l'utilisateur valide,
   * false s'il annule ou ferme la boite.
   */
  demander(options: ConfirmationOptions): Promise<boolean> {
    // une demande arrive alors qu'une autre est en attente : on libere
    // l'ancienne, qui ne doit pas rester bloquee pour toujours
    this.liberer(false);

    this.etat = {
      titre: options.titre ?? 'Confirmation',
      message: options.message,
      element: options.element ?? null,
      consequence: options.consequence ?? null,
      confirmLabel: options.confirmLabel ?? 'Supprimer',
      cancelLabel: options.cancelLabel ?? 'Annuler',
      danger: options.danger !== false,
      icone: options.icone ?? 'fas fa-exclamation-triangle',
      visible: true
    };

    return new Promise<boolean>((resolve) => {
      this.resoluteur = resolve;
    });
  }

  valider(): void {
    this.liberer(true);
  }

  annuler(): void {
    this.liberer(false);
  }

  private liberer(valider: boolean): void {
    const resoluteur = this.resoluteur;
    this.resoluteur = null;
    this.etat = this.etatVide();
    if (resoluteur) {
      resoluteur(valider);
    }
  }

  private etatVide(): ConfirmationEtat {
    return {
      titre: 'Confirmation',
      message: '',
      element: null,
      consequence: null,
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      danger: true,
      icone: 'fas fa-exclamation-triangle',
      visible: false
    };
  }
}