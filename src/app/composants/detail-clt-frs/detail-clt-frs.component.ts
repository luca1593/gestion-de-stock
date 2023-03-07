import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';

@Component({
  selector: 'app-detail-clt-frs',
  templateUrl: './detail-clt-frs.component.html',
  styleUrls: ['./detail-clt-frs.component.css']
})
export class DetailCltFrsComponent implements OnInit {

  @Input()
  origin: string = '';

  @Input()
  clientFournisseur: any;

  @Output()
  suppressioResult = new EventEmitter();

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService
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

  supprimerClltFrs(): void {
    if (this.origin === "client") {
      this.cltFrsService.deleteClient(this.clientFournisseur.id).subscribe(res => {
        this.suppressioResult.emit("success");
      }, error => {
        this.suppressioResult.emit(error.error.error);
      });
    } else if (this.origin === "fournisseur") {
      this.cltFrsService.deleteFournisseur(this.clientFournisseur.id).subscribe(res => {
        this.suppressioResult.emit("success");
      }, error => {
        this.suppressioResult.emit(error.error.error);
      });
    }
  }

}
