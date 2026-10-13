import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FactureService, SourceTypeFacture, TypeFacture } from 'src/app/services/facture/facture.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { FactureDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';
import { pageValide } from 'src/app/composants/list-utils';

@Component({
  selector: 'app-page-facture',
  templateUrl: './page-facture.component.html',
  styleUrls: ['./page-facture.component.css']
})
export class PageFactureComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  listFacture: Array<FactureDto> = [];
  listFactureFiltre: Array<FactureDto> = [];
  errorMsg: string = '';
  page: number = 1;
  pageSize: number = 5;
  loading = true;

  sortState: SortState = { column: '', direction: 'asc' };

  searchNumero = '';
  searchTiers = '';
  searchStatut = '';
  searchType = '';

  /** Facture ouverte en détail sous le tableau (une seule à la fois). */
  factureDetailId: number | null = null;

  /** Facture d'une vente ou d'une commande, utilisée en entrée d'URL. */
  private sourceFiltre: { sourceType: SourceTypeFacture; sourceId: number } | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private factureService: FactureService,
    private exportService: ExportExcelService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // La fiche client / fournisseur et le détail d'une vente ou d'une commande
    // pointent ici avec un filtre pré-rempli : on le lit avant de charger.
    this.searchTiers = this.activatedRoute.snapshot.queryParams['tiers'] ?? '';
    this.searchType = this.activatedRoute.snapshot.queryParams['type'] ?? '';
    const sourceType = this.activatedRoute.snapshot.queryParams['sourceType'];
    const sourceId = this.activatedRoute.snapshot.queryParams['sourceId'];
    if (sourceType && sourceId) {
      this.sourceFiltre = { sourceType: sourceType as SourceTypeFacture, sourceId: +sourceId };
    }
    this.findAllFacture();
  }

  /* ------------------------------------------------------------------ */
  /* Données                                                             */
  /* ------------------------------------------------------------------ */

  findAllFacture(): void {
    this.loading = true;
    this.factureService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (factures) => {
        this.listFacture = factures;
        this.listFactureFiltre = factures;
        this.applySort();
        // le filtre saisi reste affiche dans le champ : on le reapplique
        // plutot que de reafficher la liste complete sous ses yeux
        this.filtrer();
        this.page = pageValide(this.page, this.listFactureFiltre.length, this.pageSize);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Erreur lors du chargement des factures';
        this.cdr.markForCheck();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Filtres et tri (conventions AGENTS.md)                              */
  /* ------------------------------------------------------------------ */

  filtrer(): void {
    this.listFactureFiltre = this.listFacture.filter(facture => {
      const matchNumero = !this.searchNumero ||
        matchSearch(facture.numeroFacture, this.searchNumero) ||
        matchSearch(facture.montantTTC, this.searchNumero);
      const matchTiers = !this.searchTiers ||
        matchSearch(facture.clientNom, this.searchTiers) ||
        matchSearch(facture.fournisseurNom, this.searchTiers) ||
        matchSearch(facture.clientId, this.searchTiers) ||
        matchSearch(facture.fournisseurId, this.searchTiers);
      const matchStatut = !this.searchStatut || facture.statut === this.searchStatut;
      const matchType = !this.searchType || facture.typeFacture === this.searchType;
      const matchSource = !this.sourceFiltre ||
        (facture.sourceType === this.sourceFiltre.sourceType && facture.sourceId === this.sourceFiltre.sourceId);
      return matchNumero && matchTiers && matchStatut && matchType && matchSource;
    });
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  reinitialiserFiltres(): void {
    this.searchNumero = '';
    this.searchTiers = '';
    this.searchStatut = '';
    this.searchType = '';
    this.sourceFiltre = null;
    this.listFactureFiltre = this.listFacture;
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      this.listFactureFiltre = sortByProperty(this.listFactureFiltre, this.sortState.column, this.sortState.direction);
    } else {
      // Par défaut : la facture la plus récente en tête (convention du projet).
      this.listFactureFiltre = [...this.listFactureFiltre].sort(
        (a, b) => this.date(b.dateFacture) - this.date(a.dateFacture)
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */

  /** Détail d'une facture, ouvert sous sa ligne. */
  basculerDetail(facture: FactureDto): void {
    this.factureDetailId = this.factureDetailId === facture.id ? null : (facture.id ?? null);
  }

  estOuverte(facture: FactureDto): boolean {
    return this.factureDetailId === facture.id;
  }

  /** Encaissement complémentaire sur une facture non soldée. */
  encaisser(facture: FactureDto): void {
    if (!facture.id) {
      return;
    }
    this.router.navigate(['facture/paiement', facture.id]);
  }

  /** Lien vers la pièce d'origine (vente ou commande) de la facture. */
  ouvrirSource(facture: FactureDto): void {
    if (!facture.sourceId) {
      return;
    }
    switch (facture.sourceType) {
      case 'VENTE':
        this.router.navigate(['liste-vente']);
        break;
      case 'COMMANDE_CLIENT':
        this.router.navigate(['commande-client', facture.sourceId]);
        break;
      case 'COMMANDE_FOURNISSEUR':
        this.router.navigate(['commande-fournisseur', facture.sourceId]);
        break;
    }
  }

  exporterFactures(): void {
    this.exportService.exportFactures(this.listFactureFiltre);
  }

  exporterPdf(facture: FactureDto): void {
    this.exportService.exportPdfFacture(facture);
  }

  /* ------------------------------------------------------------------ */
  /* Affichage                                                           */
  /* ------------------------------------------------------------------ */

  get types(): Array<{ value: TypeFacture; label: string }> {
    return this.factureService.typesFacture;
  }

  get statuts(): Array<{ value: string; label: string }> {
    return this.factureService.statutsFacture;
  }

  libelleType(type?: string): string {
    return this.factureService.libelleType(type);
  }

  libelleStatut(statut?: string): string {
    return this.factureService.libelleStatut(statut);
  }

  libelleSource(sourceType?: string): string {
    return this.factureService.libelleSource(sourceType);
  }

  /** Libellé du filtre « liée à … » appliqué à l'entrée, pour l'affichage. */
  get sourceAffiche(): string {
    if (!this.sourceFiltre) {
      return '';
    }
    return `${this.factureService.libelleSource(this.sourceFiltre.sourceType)} #${this.sourceFiltre.sourceId}`;
  }

  classeBadge(statut?: string): string {
    return this.factureService.classeBadgeStatut(statut);
  }

  /** Nom du tiers facturé, selon le type de facture. */
  tiers(facture: FactureDto): string {
    return (facture.typeFacture === 'FOURNISSEUR' ? facture.fournisseurNom : facture.clientNom) || '—';
  }

  /** Reste dû : calculé si le backend ne le renvoie pas encore. */
  restant(facture: FactureDto): number {
    if (facture.montantRestant !== undefined && facture.montantRestant !== null) {
      return facture.montantRestant;
    }
    return Math.max(0, (facture.montantTTC ?? 0) - (facture.montantPaye ?? 0));
  }

  paye(facture: FactureDto): number {
    return facture.montantPaye ?? 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private date(valeur?: string): number {
    if (!valeur) {
      return 0;
    }
    const d = new Date(valeur).getTime();
    return isNaN(d) ? 0 : d;
  }
}