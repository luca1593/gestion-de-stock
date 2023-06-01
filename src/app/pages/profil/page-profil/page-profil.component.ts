import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-profil',
  templateUrl: './page-profil.component.html',
  styleUrls: ['./page-profil.component.css']
})
export class PageProfilComponent implements OnInit {

  @ViewChild("table")
  tableRef!: ElementRef;

  editable: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  changerMotdePasse() {
    this.router.navigate(["changer-mot-de-passe"]);
  }

  modifierProfil(){
    this.editable = true;
    this.tableRef.nativeElement.focus();
  }

  cancelClick(){
    this.editable = false;
  }

}
