import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { faSmileWink } from '@fortawesome/free-regular-svg-icons';
import { Observable, of } from 'rxjs';
import { AuthenticationRequest, AuthenticationResponse, ChangerMotDePasseUtilisateurDto, UtilisateurDto } from 'src/gs-api/src/models';
import { AuthenticationService, UtilisateurService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateurService,
    private router: Router
    ) { }

  login(authenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void{
    localStorage.setItem("accessToken", JSON.stringify(authenticationResponse));
  }

  setConnectedUser(utilisateur: UtilisateurDto): void{
    localStorage.setItem("connectedUser", JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto{
    if(localStorage.getItem("connectedUser")){
      return JSON.parse(
        localStorage.getItem("connectedUser") as string
      );
    }
    return {};
  }

  isUserLogedAndAccessTokenValid(): boolean{
    if(localStorage.getItem("accessToken")){
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

  getUserByEmail(email?: string): Observable<UtilisateurDto> {
    if(email !== undefined){
      return this.utilisateurService.UtilisateurApiFindByEmailUtilisateurGET(email);
    }
    return of();
  }

  changerMotDePasse(changerMotDePasse: ChangerMotDePasseUtilisateurDto): Observable<ChangerMotDePasseUtilisateurDto>{
    return this.utilisateurService.changerMotDePassePOST(changerMotDePasse);
  }

}
