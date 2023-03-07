import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nouvel-cmd-clt-frs',
  templateUrl: './nouvel-cmd-clt-frs.component.html',
  styleUrls: ['./nouvel-cmd-clt-frs.component.css']
})
export class NouvelCmdCltFrsComponent implements OnInit {

  origin = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });
  }

  saveClick(): void {
    
  }
  
  cancelClick(): void {
    if(this.origin === "client"){
      this.router.navigate(["commande-client"]);
    }else if(this.origin === "fournisseur"){
      this.router.navigate(["commande-fournisseur"]);
    }
  }

}
