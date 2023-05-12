import { Component, Input, OnInit } from '@angular/core';
import { UtilisateurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.css']
})
export class DetailUtilisateurComponent implements OnInit {

  @Input()
  utilisateur: UtilisateurDto = {};

  constructor() { }

  ngOnInit(): void {
  }

}
