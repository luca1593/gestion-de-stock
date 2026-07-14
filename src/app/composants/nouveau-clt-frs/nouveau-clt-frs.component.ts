import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { AdresseDto, ClientDto, FournisseurDto } from 'src/gs-api/src/models';
import { PhotoService } from 'src/gs-api/src/services';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import SavePhotoParams=PhotoService.SavePhotoParams;

@Component({
  selector: 'app-nouveau-clt-frs',
  templateUrl: './nouveau-clt-frs.component.html',
  styleUrls: ['./nouveau-clt-frs.component.css']
})
export class NouveauCltFrsComponent implements OnInit {

  origin='';

  clientFournisseur: any={};
  adresseDto: AdresseDto={};
  errorMsgs: Array<string>=[];
  submitted = false;
  file: File | null=null;
  imgUrl: string | ArrayBuffer='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2250%22%20fill%3D%22%23e9ecef%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2238%22%20r%3D%2216%22%20fill%3D%22%23adb5bd%22%2F%3E%3Cpath%20d%3D%22M18%2082c0-16%2014-30%2032-30s32%2014%2032%2030%22%20fill%3D%22%23adb5bd%22%2F%3E%3C%2Fsvg%3E';
  loading = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cltfrsService: CltfrsService,
    private photoService: PhotoService,
    private photoSyncService: PhotoSyncService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin=data['origin'];
    });
    this.findCltfrs();
  }

  findCltfrs():void{
    const id=this.activatedRoute.snapshot.params['id'];
    if(id){
      this.loading = true;
      if(this.origin === "client"){
        this.cltfrsService.findClientById(id).subscribe({
          next: (resp) => {
            this.clientFournisseur=resp;
            this.adresseDto=this.clientFournisseur.adresse;
            if (resp.photo) {
              this.imgUrl = resp.photo;
            }
            this.loading = false;
          },
          error: (error) => {
            this.errorMsgs=error.error.errors;
            this.loading = false;
          }
        });
      }else if(this.origin === "fournisseur"){
        this.cltfrsService.findFournisseurById(id).subscribe({
          next: (resp) => {
            this.clientFournisseur=resp;
            this.adresseDto=this.clientFournisseur.adresse;
            if (resp.photo) {
              this.imgUrl = resp.photo;
            }
            this.loading = false;
          },
          error: (error) => {
            this.errorMsgs=error.error.errors;
            this.loading = false;
          }
        });
      }
    } else {
      this.loading = false;
    }
  }

  enregistrer(): void {
    this.submitted = true;

    if (!this.clientFournisseur.nom || !this.adresseDto.adresse1 || !this.adresseDto.ville || !this.adresseDto.codePostal || !this.adresseDto.pays) {
      this.errorMsgs = ['Veuillez remplir tous les champs obligatoires'];
      return;
    }

    if(this.origin === "client"){
      this.cltfrsService.enregistreClient(this.mapToClient()).subscribe(resp =>{
        this.clientFournisseur = resp;
        this.savePhoto(resp.id, resp.nom + "_" + resp.prenom);
      }, error => {
        this.errorMsgs=error.error.errors;
      });
    }else if(this.origin === "fournisseur"){
      this.cltfrsService.enregistreFournisseur(this.mapToFournisseur()).subscribe(resp =>{
        this.clientFournisseur = resp;
        this.savePhoto(resp.id, resp.nom + "_" + resp.prenom);
      }, error => {
        this.errorMsgs=error.error.errors;
      });
    }
  }

  cancelClick(): void {
    this.router.navigate([ this.origin + "s"]);
  }

  mapToClient(): ClientDto{
    let ClientDto: ClientDto=this.clientFournisseur;
    ClientDto.adresse=this.adresseDto;
    return ClientDto;
  }

  mapToFournisseur(): FournisseurDto{
    let fournisseurDto: FournisseurDto=this.clientFournisseur;
    fournisseurDto.adresse=this.adresseDto;
    return fournisseurDto;
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file=files.item(0);
      if (this.file) {
        const fileReader=new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload=(event) => {
          if (fileReader.result) {
            this.imgUrl=fileReader.result;
            this.clientFournisseur.photo="";
          }
        };
      }
    }
  }

  savePhoto(idEntity?: number, titre?: string): void {
    if (idEntity && titre && this.file) {
      const params: SavePhotoParams={
        id: idEntity,
        file: this.file,
        title: titre,
        context: this.origin
      };
      this.photoService.SavePhoto(params).subscribe({
        next: (response: any) => {
          if (response && response.photo) {
            this.photoSyncService.updatePhoto(
              this.origin as 'client' | 'fournisseur',
              idEntity,
              response.photo
            );
            this.clientFournisseur.photo = response.photo;
            this.imgUrl = response.photo;
          }
          this.router.navigate([this.origin + 's']);
        },
        error: () => {
          this.router.navigate([this.origin + 's']);
        }
      });
    } else {
      this.router.navigate([this.origin + 's']);
    }
  }

}
