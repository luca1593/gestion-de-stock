import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FactureService as ApiFactureService } from 'src/gs-api/src/services/facture.service';
import { PaiementService as ApiPaiementService } from 'src/gs-api/src/services/paiement.service';
import { FactureDto, PaiementDto } from 'src/gs-api/src/models';
import { UserService } from '../user/user.service';

export type TypeFacture = 'CLIENT' | 'FOURNISSEUR';
export type SourceTypeFacture = 'VENTE' | 'COMMANDE_CLIENT' | 'COMMANDE_FOURNISSEUR';
export type StatutFacture = 'EN_ATTENTE' | 'PARTIELLEMENT_PAYEE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';
export type ModePaiement = 'ESPECES' | 'CHEQUE' | 'VIREMENT_BANCAIRE' | 'CARTE_BANCAIRE' | 'MOBILE_MONEY' | 'AUTRE';

export interface TotauxFacture {
  ht: number;
  tva: number;
  ttc: number;
}

export interface LigneFacturable {
  prixUnitaire?: number;
  quantite?: number;
  article?: { tauxTva?: number };
}

/** Erreur renvoyée par le backend : { httpCode, errorsCode, message, errors[] }. */
export interface FactureApiError {
  httpCode: number;
  errorsCode: string;
  message: string;
  errors: string[];
}

/**
 * Service applicatif des factures. Enveloppe le service généré
 * (src/gs-api) et porte les règles métier qui lui sont propres :
 * libellés français des énumérations, calcul HT/TVA/TTC à partir des lignes
 * d'une vente ou d'une commande, et normalisation des messages d'erreur.
 */
@Injectable({
  providedIn: 'root'
})
export class FactureService {

  readonly typesFacture: Array<{ value: TypeFacture; label: string }> = [
    { value: 'CLIENT', label: 'Client' },
    { value: 'FOURNISSEUR', label: 'Fournisseur' }
  ];

  readonly modesPaiement: Array<{ value: ModePaiement; label: string }> = [
    { value: 'ESPECES', label: 'Espèces' },
    { value: 'CHEQUE', label: 'Chèque' },
    { value: 'VIREMENT_BANCAIRE', label: 'Virement bancaire' },
    { value: 'CARTE_BANCAIRE', label: 'Carte bancaire' },
    { value: 'MOBILE_MONEY', label: 'Mobile money' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  readonly statutsFacture: Array<{ value: StatutFacture; label: string }> = [
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'PARTIELLEMENT_PAYEE', label: 'Partiellement payée' },
    { value: 'PAYEE', label: 'Payée' },
    { value: 'EN_RETARD', label: 'En retard' },
    { value: 'ANNULEE', label: 'Annulée' }
  ];

  constructor(
    private facturesApi: ApiFactureService,
    private paiementsApi: ApiPaiementService,
    private userService: UserService
  ) { }

  /* ------------------------------------------------------------------ */
  /* Lecture                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * L'API n'expose pas de « toutes les factures » : on concatène les deux
   * types. Chaque appel est isolé par catchError pour qu'un type en panne
   * n'en supprime pas l'autre de l'affichage.
   */
  /** Toutes les factures de l'entreprise (endpoint dédié). */
  getAll(): Observable<FactureDto[]> {
    return this.facturesApi.FactureApiAllGET();
  }

  getById(id: number): Observable<FactureDto> {
    return this.facturesApi.FactureApiByIdGET(id);
  }

  getByType(type: TypeFacture): Observable<FactureDto[]> {
    return this.facturesApi.FactureApiByTypeGET(type);
  }

  getByStatut(statut: StatutFacture): Observable<FactureDto[]> {
    return this.facturesApi.FactureApiByStatutGET(statut);
  }

  getByClient(clientId: number): Observable<FactureDto[]> {
    return this.facturesApi.FactureApiByClientGET(clientId);
  }

  getByFournisseur(fournisseurId: number): Observable<FactureDto[]> {
    return this.facturesApi.FactureApiByFournisseurGET(fournisseurId);
  }

  getBySource(sourceType: SourceTypeFacture, sourceId: number): Observable<FactureDto[]> {
    return this.facturesApi.FactureApiBySourceGET(sourceType, sourceId);
  }

  delete(id: number): Observable<null> {
    return this.facturesApi.FactureApiDeleteDELETE(id);
  }

  /** Historique des paiements d'une facture (endpoint /v1/paiements/facture). */
  getPaiementsFacture(factureId: number): Observable<PaiementDto[]> {
    return this.paiementsApi.PaiementApiByFactureGET(factureId);
  }

  /* ------------------------------------------------------------------ */
  /* Écriture                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Enregistre la facture et son paiement dans la même requête
   * (POST /v1/factures/save-avec-paiement). L'API n'accepte pas de facture
   * sans paiement : le paiement est donc obligatoire.
   *
   * L'entreprise n'est pas envoyée : le backend la déduit de l'utilisateur
   * authentifié.
   */
  saveAvecPaiement(facture: FactureDto): Observable<FactureDto> {
    const payload: FactureDto = { ...facture };
    if (payload.dateFacture) {
      payload.dateFacture = this.formatDate(payload.dateFacture);
    }
    if (payload.dateEcheance) {
      payload.dateEcheance = this.formatDate(payload.dateEcheance);
    }
    if (payload.paiement) {
      payload.paiement = { ...payload.paiement };
      if (payload.paiement.datePaiement) {
        payload.paiement.datePaiement = this.formatDate(payload.paiement.datePaiement);
      }
    }
    return this.facturesApi.FactureApiSaveAvecPaiementPOST(payload);
  }

  /* ------------------------------------------------------------------ */
  /* Règles métier                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Calcule HT / TVA / TTC d'une facture à partir de ses lignes.
   *
   * Les lignes portent un prix UNITAIRE TTC (ArticleDto.prixTtc) : le HT est
   * donc déduit ligne par ligne avec le taux de TVA de l'article, ce qui
   * reste exact quand plusieurs taux cohabitent sur une même facture.
   */
  totauxDepuisLignes(lignes: LigneFacturable[]): TotauxFacture {
    let ttc = 0;
    let ht = 0;
    (lignes ?? []).forEach(ligne => {
      const quantite = ligne.quantite ?? 0;
      const prix = ligne.prixUnitaire ?? 0;
      const taux = ligne.article?.tauxTva ?? 0;
      const ttcLigne = prix * quantite;
      const htLigne = taux ? ttcLigne / (1 + taux / 100) : ttcLigne;
      ttc += ttcLigne;
      ht += htLigne;
    });
    const ttcArrondi = this.arrondi(ttc);
    const htArrondi = this.arrondi(ht);
    return { ht: htArrondi, tva: this.arrondi(ttcArrondi - htArrondi), ttc: ttcArrondi };
  }

  /**
   * Construit la facture d'une vente ou d'une commande, à encaisser
   * immédiatement.
   *
   * Deux contraintes dictées par le backend (vérifiées sur l'API) :
   * - `numeroFacture` est obligatoire. Sans lui, l'endpoint renvoie un 500 :
   *   le backend ne génère pas de numéro, il faut donc le produire ici. On
   *   s'appuie sur le code de la pièce (VNT… / CC… / CF…) plus l'horodatage,
   *   ce qui garantit l'unicité même sur deux enregistrements dans la seconde.
   * - `paiement.montantDonne` est obligatoire pour un paiement en espèces
   *   (« Veuillez renseigner la somme remise par le payeur »). On le renvoie
   *   systématiquement, égal au montant quand le client rend exactement la
   *   somme due.
   *
   * La date d'échéance vaut 30 jours après la facture : c'est un délai de
   * paiement par défaut, modifiable ensuite.
   */
  preparerFactureSource(options: {
    type: TypeFacture;
    sourceType: SourceTypeFacture;
    sourceId: number;
    lignes: LigneFacturable[];
    codeSource?: string;
    clientId?: number;
    fournisseurId?: number;
    paiement: PaiementDto;
  }): FactureDto {
    const totaux = this.totauxDepuisLignes(options.lignes);
    const facture: FactureDto = {
      numeroFacture: this.genererNumeroFacture(options.codeSource),
      dateFacture: new Date().toISOString(),
      typeFacture: options.type,
      sourceType: options.sourceType,
      sourceId: options.sourceId,
      montantHT: totaux.ht,
      montantTVA: totaux.tva,
      montantTTC: totaux.ttc,
      dateEcheance: this.datePlus(30),
      paiement: this.completerPaiement(options.paiement)
    };
    if (options.type === 'CLIENT') {
      facture.clientId = options.clientId;
    } else {
      facture.fournisseurId = options.fournisseurId;
    }
    return facture;
  }

  /**
   * Numéro de facture unique : préfixe de la pièce d'origine (VNT, CC, CF)
   * suivi de l'horodatage au seconde. Lisible (on retrouve la pièce) et
   * unique même sur deux enregistrements dans la même seconde.
   */
  private genererNumeroFacture(codeSource?: string): string {
    const prefixe = (codeSource ?? 'FACT').replace(/[^A-Za-z0-9]/g, '');
    const d = new Date();
    const horodatage = [
      d.getFullYear(),
      this.pad(d.getMonth() + 1),
      this.pad(d.getDate()),
      this.pad(d.getHours()),
      this.pad(d.getMinutes()),
      this.pad(d.getSeconds())
    ].join('');
    return `FACT-${prefixe}-${horodatage}`;
  }

  private pad(v: number): string {
    return v < 10 ? '0' + v : '' + v;
  }

  /**
   * Le backend refuse un paiement en espèces sans « somme remise par le
   * payeur ». On l'ajoute donc toujours, aligné sur le montant quand le
   * client n'a rien donné en trop.
   */
  private completerPaiement(paiement: PaiementDto): PaiementDto {
    const complet: PaiementDto = { ...paiement };
    if (complet.montantDonne === undefined || complet.montantDonne === null) {
      complet.montantDonne = complet.montant ?? 0;
    }
    if (complet.monnaie === undefined || complet.monnaie === null) {
      complet.monnaie = Math.max(0, complet.montantDonne - (complet.montant ?? 0));
    }
    return complet;
  }

  /**
   * Facture d'un encaissement supplémentaire sur une facture existante : on
   * renvoie la facture telle quelle avec le nouveau paiement imbriqué, ce que
   * l'endpoint sait faire (il recalcule montantPaye, montantRestant et
   * statut).
   */
  preparerPaiementSupplementaire(facture: FactureDto, paiement: PaiementDto): FactureDto {
    return { ...facture, paiement: this.completerPaiement(paiement) };
  }

  /* ------------------------------------------------------------------ */
  /* Libellés et formats                                                  */
  /* ------------------------------------------------------------------ */

  libelleType(type?: string): string {
    return this.typesFacture.find(t => t.value === type)?.label ?? (type ?? '—');
  }

  libelleStatut(statut?: string): string {
    return this.statutsFacture.find(s => s.value === statut)?.label ?? (statut ?? '—');
  }

  libelleModePaiement(mode?: string): string {
    return this.modesPaiement.find(m => m.value === mode)?.label ?? (mode ?? '—');
  }

  libelleSource(sourceType?: string): string {
    switch (sourceType) {
      case 'VENTE': return 'Vente';
      case 'COMMANDE_CLIENT': return 'Commande client';
      case 'COMMANDE_FOURNISSEUR': return 'Commande fournisseur';
      default: return sourceType ?? '—';
    }
  }

  /** Classe Bootstrap du badge de statut (couleur = information secondaire). */
  classeBadgeStatut(statut?: string): string {
    switch (statut) {
      case 'PAYEE': return 'badge-success';
      case 'PARTIELLEMENT_PAYEE': return 'badge-warning';
      case 'EN_RETARD': return 'badge-danger';
      case 'ANNULEE': return 'badge-secondary';
      default: return 'badge-info';
    }
  }

  /** Messages d'erreur du backend, à plat, prêts à afficher. */
  messagesErreur(error: any): string[] {
    const body = error?.error ?? error;
    if (Array.isArray(body?.errors) && body.errors.length) {
      return body.errors;
    }
    if (body?.message) {
      return [body.message];
    }
    return ['Erreur lors de l\'enregistrement de la facture'];
  }

  entrepriseId(): number | undefined {
    return this.userService.getConnectedUser()?.entreprise?.id;
  }

  /* ------------------------------------------------------------------ */
  /* Outils                                                              */
  /* ------------------------------------------------------------------ */

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? '' : d.toISOString();
  }

  private datePlus(jours: number): string {
    const d = new Date();
    d.setDate(d.getDate() + jours);
    return d.toISOString();
  }

  private arrondi(valeur: number): number {
    return Math.round((valeur + Number.EPSILON) * 100) / 100;
  }
}