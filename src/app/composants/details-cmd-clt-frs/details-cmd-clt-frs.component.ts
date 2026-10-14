import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal/modal.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationService } from 'src/app/composants/confirmation/confirmation.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-details-cmd-clt-frs',
  templateUrl: './details-cmd-clt-frs.component.html',
  styleUrls: ['./details-cmd-clt-frs.component.css']
})
export class DetailsCmdCltFrsComponent implements OnInit, OnDestroy {

  @Input()
  origin="";

  @Input()
  commande: any={};

  @Input()
  lineDeCommande: any;
  cltFrsDto: any={};
  
  @Output()
  etatChanged = new EventEmitter<{id: number, etat: string}>();

  /** Emis apres une suppression reussie, pour que la liste se recharge. */
  @Output()
  supprimChanged = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: ModalService,
    private commandeCltFrs: CmdCltFrsService,
    private confirmation: ConfirmationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.extractCltFrs();
  }

  extractCltFrs(): void{
    if (this.origin === "client") {
      this.cltFrsDto=this.commande?.client;
    } else if(this.origin === "fournisseur"){
      this.cltFrsDto=this.commande?.fournisseur;
    }
  }

  modifier(): void {
    if (this.origin === "client") {
      this.router.navigate(['nouvel-commande-client', this.commande.id]);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['nouvel-commande-fournisseur', this.commande.id]);
    }
  }

  openDetailsModal(): void {
    const modalId = 'modalDetail' + this.commande.code;
    this.modalService.openModal(modalId);
  }

  closeDetailsModal(): void {
    const modalId = 'modalDetail' + this.commande.code;
    this.modalService.closeModal(modalId);
  }

  async supprimer(idCommande: number): Promise<void> {
    if (!idCommande) return;

    const libelle = this.origin === "fournisseur" ? "cette commande fournisseur" : "cette commande client";
    const ok = await this.confirmation.demander({
      titre: 'Supprimer la commande ?',
      message: 'Voulez-vous vraiment supprimer ' + libelle + ' ?',
      element: this.commande?.code || null,
      consequence: "Les articles qui y figuraient seront de nouveau disponibles au stock.",
      icone: 'fas fa-file-invoice'
    });
    if (!ok) return;

    const traiter = {
      next: () => {
        this.modalService.closeModal('modalDetail' + this.commande.code);
        this.supprimChanged.emit(true);
        this.notificationService.addSuccess('Suppression', 'Commande supprimée');
      },
      error: (err: any) => {
        // alert() du navigateur : bloquant, non stylable, et invisible
        // pour un utilisateur qui filtre la page
        this.notificationService.addError(
          'Erreur',
          err.error?.error || err.message || "Erreur lors de la suppression"
        );
      }
    };

    if (this.origin === "client") {
      this.commandeCltFrs.supprimerCommandeClient(idCommande).pipe(takeUntil(this.destroy$)).subscribe(traiter);
    } else if (this.origin === "fournisseur") {
      this.commandeCltFrs.supprimerCommandeFournisseur(idCommande).pipe(takeUntil(this.destroy$)).subscribe(traiter);
    }
  }

  onEtatChange(event: {id: number, etat: string}): void {
    this.commande.etatcommande = event.etat;
    this.etatChanged.emit(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calcluerTotalCommande() : number {
    let total=0;
    this.commande.ligneCommandeFournisseurs?.forEach((ligne: { quantite: number; }) => {
      if(ligne.quantite) {
        total += ligne.quantite;
      }
    });
    return total;
  }

  calculerPrixTotalCommande() : number {
    let total=0;
    if(this.commande){

    }

    this.commande.ligneCommandeFournisseurs?.forEach((ligne: { prixUnitaire: number; quantite: number; }) => {
      if(ligne.prixUnitaire && ligne.quantite) {
        total += (ligne.quantite * ligne.prixUnitaire);
      }
    });
    return total;
  }

}
