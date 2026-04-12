import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationRequest } from 'src/gs-api/src/models';


@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  authenticationRequest: AuthenticationRequest={};

  errorMessage="";
  loading=false;

  constructor(
    private userServices: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.userServices.isUserLogedAndAccessTokenValid()) {
      this.router.navigate(['dashbord']);
    }
  }

  login(): void {
    if (!this.authenticationRequest.login || !this.authenticationRequest.password) {
      this.errorMessage="Veuillez entrer votre email et mot de passe";
      return;
    }
    
    this.loading=true;
    this.errorMessage="";
    
    this.userServices.login(this.authenticationRequest).subscribe({
      next: (data) => {
        this.userServices.setAccessToken(data);
        this.getUserByEmail();
        this.router.navigate(['dashbord']);
        this.loading=false;
      },
      error: (error) => {
        this.loading=false;
        if (error.error?.errorsCode === "UTILISATEUR_NOT_FOUND") {
          this.errorMessage=error.error?.message || "Utilisateur non trouvé";
        } else if (error.error?.errorsCode === "INVALID_PASSWORD") {
          this.errorMessage="Mot de passe incorrect";
        } else {
          this.errorMessage=error.error?.errors || "Une erreur est survenue lors de la connexion";
        }
      }
    });
  }

  getUserByEmail(): void {
    this.userServices.getUserByEmail(this.authenticationRequest.login).subscribe(user => {
      this.userServices.setConnectedUser(user);
    });
  }

}
