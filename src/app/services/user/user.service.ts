import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticationRequest, AuthenticationResponse, ChangerMotDePasseUtilisateurDto, UtilisateurDto } from 'src/gs-api/src/models';
import { AuthenticationService, UtilisateurService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  accessToken: string = "accessToken";
  connectedUser: string = "connectedUser";

  constructor(
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateurService,
    private router: Router
    ) { }

  login(authenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void{
    localStorage.setItem(this.accessToken, JSON.stringify(authenticationResponse));
  }

  setConnectedUser(utilisateur: UtilisateurDto): void{
    localStorage.setItem(this.connectedUser, JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto{
    if(localStorage.getItem(this.connectedUser)){
      return JSON.parse(
        localStorage.getItem(this.connectedUser) as string
      );
    }
    return {};
  }

  isUserLogedAndAccessTokenValid(): boolean{
    if(localStorage.getItem(this.accessToken)){
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

  findAll(): Observable<UtilisateurDto[]>{
    return this.utilisateurService.UtilisateurApiFindAllGET();
  }

}
