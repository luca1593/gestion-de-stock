import { Component, Input, OnInit } from '@angular/core';
import { LigneCommandeClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-details-cmd',
  templateUrl: './details-cmd.component.html',
  styleUrls: ['./details-cmd.component.css']
})
export class DetailsCmdComponent implements OnInit {

  @Input()
  ligneCommande: LigneCommandeClientDto = {}

  constructor() { }

  ngOnInit(): void {
  }

}
