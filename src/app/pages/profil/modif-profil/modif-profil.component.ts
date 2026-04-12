import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurService } from 'src/gs-api/src/services';
import { UtilisateurDto, AdresseDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-modif-profil',
  templateUrl: './modif-profil.component.html',
  styleUrls: ['./modif-profil.component.css']
})
export class ModifProfilComponent implements OnInit {

  utilisateurDto: UtilisateurDto = {};
  adresseDto: AdresseDto = {};
  errorMsgs: Array<string> = [];

  constructor(
    private userService: UserService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.utilisateurDto = this.userService.getConnectedUser();
    this.adresseDto = this.utilisateurDto.adresse || {};
  }

  saveClick(): void {
    this.utilisateurDto.adresse = this.adresseDto;
    this.utilisateurService.UtilisateurApiSavePOST(this.utilisateurDto).subscribe({
      next: (user) => {
        this.userService.setConnectedUser(user);
        this.router.navigate(['profil']);
      },
      error: (error) => {
        this.errorMsgs = error.error.errors || ['Une erreur est survenue'];
      }
    });
  }

  cancelClick(): void {
    this.router.navigate(['profil']);
  }
}
