import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PaiementDto } from 'src/gs-api/src/models';
import { FactureService, ModePaiement } from 'src/app/services/facture/facture.service';

export interface Encaissement {
  paiement: PaiementDto;
  /** true quand les champs sont cohérents : le parent peut enregistrer. */
  valide: boolean;
  messages: string[];
}

/**
 * Saisie de l'encaissement d'une facture : mode de paiement, montant payé,
 * montant donné et monnaie à rendre.
 *
 * Le composant ne connaît ni la vente ni la commande : il reçoit le montant
 * dû (montantDu) et renvoie l'état du paiement. Les trois pages d'écriture
 * (vente, commande client, commande fournisseur) le réutilisent tel quel, ce
 * qui évite trois fois le même formulaire et trois fois les mêmes règles.
 *
 * Montant donné / monnaie à rendre n'ont de sens qu'en espèces : les autres
 * modes encaissent un montant exact, le champ est donc masqué et la monnaie
 * forcée à 0.
 */
@Component({
  selector: 'app-encaissement',
  templateUrl: './encaissement.component.html',
  styleUrls: ['./encaissement.component.css']
})
export class EncaissementComponent implements OnChanges {

  /** Montant TTC à encaisser. */
  @Input() montantDu = 0;

  /** Intitulé du montant dû, pour que le total soit lisible dans le contexte. */
  @Input() libelleMontant = 'Total à payer';

  /** N'affiche le champ « montant donné » que pour ces modes. */
  @Input() modesAvecMonnaie: ModePaiement[] = ['ESPECES'];

  @Output() encaissementChange = new EventEmitter<Encaissement>();

  submitted = false;

  modePaiement: ModePaiement = 'ESPECES';
  montantDonne: number | null = null;
  reference = '';
  datePaiement: string = this.aujourdhui();
  note = '';

  /** Mis à true dès que l'utilisateur touche au champ : le montant donné
   *  cesse alors de suivre automatiquement le total. */
  montantDonneSaisi = false;

  constructor(public factureService: FactureService) { }

  /**
   * Le montant payé n'est plus saisi : il EST le total à payer. Le champ a
   * été retiré du formulaire parce qu'il n'apportait rien — il était rempli
   * par le calcul et sa seule vraie variable était le montant donné.
   *
   * On garde le suivi automatique du montant donné tant qu'il n'est pas
   * saisi : le panier change à chaque ligne ajoutée ou retirée, et une valeur
   * figée serait fausse dès la première modification.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['montantDu']) {
      if (this.afficheMontantDonne && !this.montantDonneSaisi) {
        this.montantDonne = this.montantDu;
      }
      this.diffuser();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Valeurs dérivées                                                     */
  /* ------------------------------------------------------------------ */

  /** Le montant donné a été saisi manuellement : on ne le suit plus. */
  onMontantDonneChange(): void {
    this.montantDonneSaisi = true;
    this.diffuser();
  }

  get modes(): Array<{ value: ModePaiement; label: string }> {
    return this.factureService.modesPaiement;
  }

  /** Le champ « montant donné » n'a de sens qu'en espèces (ou modes proches). */
  get afficheMontantDonne(): boolean {
    return this.modesAvecMonnaie.includes(this.modePaiement);
  }

  /** Chèque et virement se retrouvent : sans référence, le suivi est impossible. */
  get referenceObligatoire(): boolean {
    return this.modePaiement === 'CHEQUE' || this.modePaiement === 'VIREMENT_BANCAIRE';
  }

  get montantDuArrondi(): number {
    return this.arrondi(this.montantDu);
  }

  /**
   * Montant payé : toujours égal au total à payer, jamais saisi.
   *
   * Un paiement partiel se saisit en donnant un montant inférieur au total
   * via le montant donné : le reste dû est alors calculé et affiché.
   */
  get montant(): number {
    return this.montantDuArrondi;
  }

  /**
   * Reste dû après l'encaissement : le total de la vente moins ce que le
   * client a réellement versé (montant donné quand il est connu, montant
   * payé sinon pour les modes sans somme rendue).
   *
   * Renvoyer `null` quand il n'y a rien à signaler évite d'afficher un
   * « reste 0,00 Ar » à côté d'une monnaie à rendre non nulle.
   */
  get resteApresDonne(): number | null {
    const verse = this.afficheMontantDonne ? (this.montantDonne ?? 0) : (this.montant ?? 0);
    const reste = this.arrondi(Math.max(0, this.montantDu - verse));
    return reste > 0 ? reste : null;
  }

  /**
   * Monnaie à rendre : ce que le client donne MOINS le total des articles.
   *
   * C'est le total de la vente qui sert de référence, pas le montant payé :
   * le montant payé peut être inférieur (paiement partiel, acompte) et dans
   * ce cas le client n'a rien à recevoir — il doit au contraire le reste.
   * Calculer la monnaie sur le montant payé afficherait un chiffre faux dans
   * ce cas, en affichant comme « monnaie à rendre » ce qui est en fait une
   * somme restant due.
   *
   * Jamais négative : un montant donné inférieur au total est un paiement
   * partiel, pas une monnaie.
   */
  get monnaie(): number {
    if (!this.afficheMontantDonne) {
      return 0;
    }
    return this.arrondi(Math.max(0, (this.montantDonne ?? 0) - this.montantDu));
  }

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */

  /** Le client donne exactement le montant dû : plus de saisie à faire. */
  remplirMontantExact(): void {
    this.montantDonne = this.afficheMontantDonne ? this.montantDu : null;
    this.montantDonneSaisi = false;
    this.diffuser();
  }

  onModeChange(): void {
    if (!this.afficheMontantDonne) {
      this.montantDonne = null;
      this.montantDonneSaisi = false;
      this.reference = '';
    }
    this.diffuser();
  }

  /** Verrouille la saisie d'un montant négatif au clavier. */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  /** Publie l'état du paiement au parent (vente ou commande). */
  diffuser(): void {
    const messages = this.validation();
    this.encaissementChange.emit({
      paiement: {
        montant: this.montant,
        montantDonne: this.afficheMontantDonne ? this.arrondi(this.montantDonne ?? 0) : undefined,
        monnaie: this.monnaie,
        datePaiement: this.datePaiement,
        modePaiement: this.modePaiement,
        reference: this.reference || undefined,
        note: this.note || undefined
      },
      valide: messages.length === 0,
      messages
    });
  }

  /**
   * Règles de saisie.
   *
   * Le montant payé n'est plus saisi, il découle du total : il n'y a donc
   * rien à valider de ce côté, seulement à vérifier que le total est bien
   * positif (sinon le panier est vide et rien ne peut être enregistré).
   *
   * Le montant donné reste libre : il peut être supérieur au total (monnaie
   * à rendre) ou inférieur (paiement partiel, vente à crédit). Aucun des deux
   * cas n'est bloqué, le second est une vente normale.
   */
  private validation(): string[] {
    const messages: string[] = [];

    if (this.montant <= 0) {
      messages.push('Le total à payer doit être supérieur à 0');
    }

    if (this.afficheMontantDonne) {
      const donne = this.montantDonne;
      if (donne === null || donne === undefined || isNaN(donne)) {
        messages.push('Veuillez renseigner le montant donné');
      }
    }

    if (!this.datePaiement) {
      messages.push('Veuillez renseigner la date du paiement');
    }

    if ((this.modePaiement === 'CHEQUE' || this.modePaiement === 'VIREMENT_BANCAIRE')
        && !this.reference.trim()) {
      messages.push('La référence est obligatoire pour un paiement par chèque ou virement');
    }

    return messages;
  }

  private aujourdhui(): string {
    const d = new Date();
    return [
      d.getFullYear(),
      (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
      d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    ].join('-');
  }

  private arrondi(valeur: number): number {
    return Math.round((valeur + Number.EPSILON) * 100) / 100;
  }
}