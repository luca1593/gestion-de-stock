import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { AdresseDto, ClientDto, FournisseurDto } from 'src/gs-api/src/models';
import { PhotoService } from 'src/gs-api/src/services';
import SavePhotoParams = PhotoService.SavePhotoParams;

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
  file: File | null = null;
  imgUrl: string | ArrayBuffer = 'favicon.ico';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cltfrsService: CltfrsService,
    private photoService: PhotoService
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
        this.savePhoto(resp.id, resp.nom + "_" + resp.prenom);
      }, error => {
        this.errorMsgs = error.error.errors;
      });
    }else if(this.origin === "fournisseur"){
      this.cltfrsService.enregistreFournisseur(this.mapToFournisseur()).subscribe(resp =>{
        this.router.navigate(["fournisseurs"]);
        this.savePhoto(resp.id, resp.nom + "_" + resp.prenom);
      }, error => {
        this.errorMsgs = error.error.errors;
      });
    }
  }

  cancelClick(): void {
    this.router.navigate([ this.origin + "s"]);
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

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
            this.clientFournisseur.photo = "";
          }
        };
      }
    }
  }

  savePhoto(idArticle?: number, titre?: string): void {
    if (idArticle && titre && this.file) {
      const params: SavePhotoParams = {
        id: idArticle,
        file: this.file,
        title: titre,
        context: this.origin
      };
      this.photoService.SavePhoto(params)
      .subscribe(res => {
        this.router.navigate([this.origin + 's']);
      });
    } else {
      this.router.navigate([this.origin + 's']);
    }
  }

}
