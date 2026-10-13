import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationService } from 'src/app/composants/confirmation/confirmation.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-detail-clt-frs',
  templateUrl: './detail-clt-frs.component.html',
  styleUrls: ['./detail-clt-frs.component.css']
})
export class DetailCltFrsComponent implements OnInit, OnDestroy {

  @Input()
  origin: string='';

  @Input()
  clientFournisseur: any;

  @Output()
  suppressioResult=new EventEmitter();

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService,
    private modalService: ModalService,
    private confirmation: ConfirmationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  modifierCltFrs(): void {
    if (this.origin === "client") {
      this.router.navigate(["nouveau-client", this.clientFournisseur.id]);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['nouveau-fournisseur', this.clientFournisseur.id]);
    }
  }

  async openDeleteModal(): Promise<void> {
    const estClient = this.origin === "client";
    const nomComplet = [this.clientFournisseur?.nom, this.clientFournisseur?.prenom]
      .filter(Boolean).join(' ');

    const ok = await this.confirmation.demander({
      titre: estClient ? 'Supprimer ce client ?' : 'Supprimer ce fournisseur ?',
      message: 'Voulez-vous vraiment supprimer ' + (estClient ? 'ce client' : 'ce fournisseur') + ' ?',
      element: nomComplet || null,
      consequence: estClient
        ? 'Ses ventes et factures resteront enregistrées, mais la fiche disparaît des listes.'
        : 'Ses commandes resteront enregistrées, mais la fiche disparaît des listes.',
      icone: estClient ? 'fas fa-user-tie' : 'fas fa-dolly'
    });
    if (!ok) return;

    const surSucces = () => {
      this.suppressioResult.emit("success");
      this.notificationService.addSuccess('Suppression', estClient ? 'Client supprimé' : 'Fournisseur supprimé');
    };
    const surErreur = (err: any) => {
      this.suppressioResult.emit(err.error?.message);
      this.notificationService.addError('Erreur', err.error?.message || 'Erreur lors de la suppression');
    };

    if (estClient) {
      this.cltFrsService.deleteClient(this.clientFournisseur.id).pipe(takeUntil(this.destroy$))
        .subscribe({ next: surSucces, error: surErreur });
    } else {
      this.cltFrsService.deleteFournisseur(this.clientFournisseur.id).pipe(takeUntil(this.destroy$))
        .subscribe({ next: surSucces, error: surErreur });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  detailCltFrs(){
    if (this.origin === "client") {
      this.router.navigate(["detail-client", this.clientFournisseur.id]);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['detail-fournisseur', this.clientFournisseur.id]);
    }
  }

}
