import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { FournisseurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-fournisseur',
  templateUrl: './page-fournisseur.component.html',
  styleUrls: ['./page-fournisseur.component.css']
})
export class PageFournisseurComponent implements OnInit {

  listFournisseur:Array<FournisseurDto> = [];
  errorMsg: string = '';
  page: number = 1;

  constructor(
    private router: Router,
    private cltfrsService: CltfrsService
    ) { }

  ngOnInit(): void {
    this.finfAllFournisseur();
  }

  finfAllFournisseur(): void{
    this.cltfrsService.findAllFournisseurs().subscribe(resp =>{
      this.listFournisseur = resp;
    })
  }

  nouveauFournisseurs(): void{
    this.router.navigate(['nouveau-fournisseur']);
  }

  handleSuppression($event: any): void {
    if($event === "success"){
      this.finfAllFournisseur();
    }else{
      this.errorMsg = $event;
    }
  }

}
