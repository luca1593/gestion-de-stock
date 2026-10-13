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
  errorMsg = "";
  successMsg = "";
  loading = false;
  submitted = false;

  /*
   * Le DTO du backend ne contient que id / motDePasse / confirmMotDePasse :
   * l'ancien mot de passe n'est jamais transmis et ne peut donc pas être
   * vérifié. Le champ reste affiché parce qu'il est attendu dans le parcours,
   * mais l'interface annonce explicitement qu'il ne protège rien.
   */
  readonly ancienMdpNonVerifie = true;

  readonly longueurMin = 4;

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
    this.submitted = true;
    this.errorMsg = "";
    this.successMsg = "";

    const nouveau = this.changerMotdePasse.motDePasse ?? '';
    const confirmation = this.changerMotdePasse.confirmMotDePasse ?? '';

    if (!nouveau || !confirmation) {
      this.errorMsg = 'Merci de saisir le nouveau mot de passe et sa confirmation.';
      return;
    }
    if (nouveau.length < this.longueurMin) {
      this.errorMsg = 'Le nouveau mot de passe doit contenir au moins ' + this.longueurMin + ' caractères.';
      return;
    }
    if (nouveau !== confirmation) {
      this.errorMsg = 'Les deux mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.changerMotdePasse.id = this.userService.getConnectedUser().id;
    this.userService.changerMotDePasse(this.changerMotdePasse).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Mot de passe modifié.';
        // laisse le temps de lire la confirmation avant de quitter la page
        setTimeout(() => this.router.navigate(['profil']), 1200);
      },
      /*
       * Sans ce bloc d'erreur, un mot de passe non conforme ou une
       * confirmation differente renvoyait un 400 silencieusement : le
       * bouton paraissait sans effet et l'utilisateur recommençait a l'aveugle.
       */
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Le mot de passe n\'a pas pu être modifié.';
      }
    });
  }

  cancelClick(): void {
    this.router.navigate(["profil"]);
  }

}
