import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LigneCommandeClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-details-cmd',
  templateUrl: './details-cmd.component.html',
  styleUrls: ['./details-cmd.component.css']
})
export class DetailsCmdComponent {

  @Input()
  ligneCommande: LigneCommandeClientDto={}

  @Input()
  readonly: boolean = false;

  @Output()
  deleteLigne = new EventEmitter<LigneCommandeClientDto>();

  @Output()
  quantiteChange = new EventEmitter<{ligne: LigneCommandeClientDto, delta: number}>();

  onDelete(): void {
    this.deleteLigne.emit(this.ligneCommande);
  }

  incrementer(): void {
    this.quantiteChange.emit({ligne: this.ligneCommande, delta: 1});
  }

  decrementer(): void {
    this.quantiteChange.emit({ligne: this.ligneCommande, delta: -1});
  }

}
