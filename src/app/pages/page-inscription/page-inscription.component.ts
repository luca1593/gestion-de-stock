import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/services/entreprise/entreprise.service';
import { UserService } from 'src/app/services/user/user.service';
import { AdresseDto, AuthenticationRequest, EntrepriseDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-inscription',
  templateUrl: './page-inscription.component.html',
  styleUrls: ['./page-inscription.component.css']
})
export class PageInscriptionComponent implements OnInit {

  entrepriseDto: EntrepriseDto = {};
  adresseDto: AdresseDto = {};
  errorMessage: Array<string> = [];

  constructor(
    private entrepriseService: EntrepriseService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  inscrire(): void {
    this.entrepriseDto.adresse = this.adresseDto;
    this.entrepriseService.sinscrire(this.entrepriseDto).subscribe(entrepriseDto =>{
      this.connetedEntreprise();
    }, error => {
      this.errorMessage = error.error.errors;
    })
  }

  connetedEntreprise(): void{
    const authenticationRequest: AuthenticationRequest = {
      login: this.entrepriseDto.email,
      password: "s0n3R@nd0mP@$$w0rd"
    };
    this.userService.login(authenticationRequest).subscribe(response =>{
      this.userService.setAccessToken(response);
      this.getUserByEmail(authenticationRequest.login);
      localStorage.setItem("origin", "inscription");
      this.router.navigate(['changer-mot-de-passe']);
    });
  }

  getUserByEmail(email?: string): void{
    this.userService.getUserByEmail(email).subscribe(user =>{
      this.userService.setConnectedUser(user);
    });
  }

}
