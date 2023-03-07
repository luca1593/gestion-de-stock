import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { AdresseDto, ClientDto, FournisseurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-nouveau-clt-frs',
  templateUrl: './nouveau-clt-frs.component.html',
  styleUrls: ['./nouveau-clt-frs.component.css']
})
export class NouveauCltFrsComponent implements OnInit {

  origin = '';

  clientFournisseur: any = {};
  adresseDto: AdresseDto = {};
  errorMsgs: Array<string> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cltfrsService: CltfrsService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });
    this.findCltfrs();
  }

  findCltfrs():void{
    const id = this.activatedRoute.snapshot.params['id'];
    if(id){
      if(this.origin === "client"){
        this.cltfrsService.findClientById(id).subscribe(resp =>{
          this.clientFournisseur = resp;
          this.adresseDto = this.clientFournisseur.adresse;
        }, error => {
          this.errorMsgs = error.error.errors;
        });
      }else if(this.origin === "fournisseur"){
        this.cltfrsService.findFournisseurById(id).subscribe(resp =>{
          this.clientFournisseur = resp;
          this.adresseDto = this.clientFournisseur.adresse;
        }, error => {
          this.errorMsgs = error.error.errors;
        });
      }
    }
  }

  enregistrer(): void {
    if(this.origin === "client"){
      this.cltfrsService.enregistreClient(this.mapToClient()).subscribe(resp =>{
        this.router.navigate(["clients"]);
      }, error => {
        this.errorMsgs = error.error.errors;
      });
    }else if(this.origin === "fournisseur"){
      this.cltfrsService.enregistreFournisseur(this.mapToFournisseur()).subscribe(resp =>{
        this.router.navigate(["fournisseurs"]);
      }, error => {
        this.errorMsgs = error.error.errors;
      });
    }
  }
  
  cancelClick(): void {
    if(this.origin === "client"){
      this.router.navigate(["clients"]);
    }else if(this.origin === "fournisseur"){
      this.router.navigate(["fournisseurs"]);
    }
  }

  mapToClient(): ClientDto{
    let ClientDto: ClientDto = this.clientFournisseur;
    ClientDto.adresse = this.adresseDto;
    return ClientDto;
  }

  mapToFournisseur(): FournisseurDto{
    let fournisseurDto: FournisseurDto = this.clientFournisseur;
    fournisseurDto.adresse = this.adresseDto;
    return fournisseurDto;
  }

}
