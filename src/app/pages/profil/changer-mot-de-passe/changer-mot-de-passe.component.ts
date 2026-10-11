import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import { ChangerMotDePasseUtilisateurDto } from 'src/gs-api/src/models/changer-mot-de-passe-utilisateur-dto';

@Component({
  selector: 'app-changer-mot-de-passe',
  templateUrl: './changer-mot-de-passe.component.html',
  styleUrls: ['./changer-mot-de-passe.component.css']
})
export class ChangerMotDePasseComponent implements OnInit {

  changerMotdePasse: ChangerMotDePasseUtilisateurDto={};
  ancienMdp="";
  utilisateurDto: any={};
  photoUtilisateur: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private photoSyncService: PhotoSyncService
    ) { }

  ngOnInit(): void {
    const user = this.userService.getConnectedUser();
    this.utilisateurDto = user || {};
    this.photoUtilisateur = this.photoSyncService.getPhotoUrl('utilisateur', user?.id ?? 0)
      || this.utilisateurDto.photo
      || null;
    if(localStorage.getItem("origin") && localStorage.getItem("origin") === "inscription"){
      this.ancienMdp="s0n3R@nd0mP@$$w0rd";
      localStorage.removeItem("origin");
    }
  }

  getUserInitials(): string {
    const nom = (this.utilisateurDto?.nom || '').charAt(0);
    const prenom = (this.utilisateurDto?.prenom || '').charAt(0);
    return (prenom + nom).toUpperCase() || '?';
  }

  getAdresse(): string {
    const a = this.utilisateurDto?.adresse;
    if (!a) return '-';
    return [a.adresse1, a.ville, a.codePostal].filter(v => v).join(', ') || '-';
  }

  saveClick(): void {
    this.changerMotdePasse.id =this.userService.getConnectedUser().id;
    this.userService.changerMotDePasse(this.changerMotdePasse).subscribe(data=>{
      this.router.navigate(['profil']);
    });
  }

  cancelClick(): void {
    this.router.navigate(["profil"]);
  }

}
