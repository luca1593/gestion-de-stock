import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private modalService: ModalService
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

  openDeleteModal(): void {
    const modalId = 'modalConfirmDelete' + this.clientFournisseur.id;
    this.modalService.openModal(modalId);
  }

  supprimerClltFrs(): void {
    if (this.origin === "client") {
      this.cltFrsService.deleteClient(this.clientFournisseur.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.suppressioResult.emit("success");
          this.closeDeleteModal();
        },
        error: (err) => {
          this.suppressioResult.emit(err.error?.message);
          this.closeDeleteModal();
        }
      });
    } else if (this.origin === "fournisseur") {
      this.cltFrsService.deleteFournisseur(this.clientFournisseur.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.suppressioResult.emit("success");
          this.closeDeleteModal();
        },
        error: (err) => {
          this.suppressioResult.emit(err.error?.message);
          this.closeDeleteModal();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDeleteModal(): void {
    const modalId = 'modalConfirmDelete' + this.clientFournisseur.id;
    this.modalService.closeModal(modalId);
  }

  detailCltFrs(){
    if (this.origin === "client") {
      this.router.navigate(["detail-client", this.clientFournisseur.id]);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['detail-fournisseur', this.clientFournisseur.id]);
    }
  }

}
