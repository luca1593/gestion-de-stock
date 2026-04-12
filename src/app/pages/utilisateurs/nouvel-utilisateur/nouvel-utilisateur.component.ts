import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurService } from 'src/gs-api/src/services';
import { UtilisateurDto, AdresseDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-nouvel-utilisateur',
  templateUrl: './nouvel-utilisateur.component.html',
  styleUrls: ['./nouvel-utilisateur.component.css']
})
export class NouvelUtilisateurComponent implements OnInit {

  utilisateurDto: UtilisateurDto = {};
  adresseDto: AdresseDto = {};
  errorMsgs: Array<string> = [];

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  saveClick(): void {
    this.utilisateurDto.adresse = this.adresseDto;
    this.utilisateurDto.entreprise = this.userService.getConnectedUser().entreprise;
    this.utilisateurService.UtilisateurApiSavePOST(this.utilisateurDto).subscribe({
      next: () => {
        this.router.navigate(['utilisateurs']);
      },
      error: (error) => {
        this.errorMsgs = error.error.errors || ['Une erreur est survenue'];
      }
    });
  }

  cancelClick(): void {
    this.router.navigate(['utilisateurs']);
  }
}
