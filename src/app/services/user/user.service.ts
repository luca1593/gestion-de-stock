import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthenticationRequest, AuthenticationResponse, ChangerMotDePasseUtilisateurDto, UtilisateurDto } from 'src/gs-api/src/models';
import { AuthenticationService, UtilisateurService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly TOKEN_KEY = 'gs_access_token';
  private readonly USER_KEY = 'gs_user';
  private readonly REMEMBER_KEY = 'gs_remember';
  
  private connectedUserSubject = new BehaviorSubject<UtilisateurDto | null>(null);
  connectedUser$ = this.connectedUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.initSession();
    this.setupVisibilityHandler();
  }

  private get storage(): Storage {
    return (sessionStorage.getItem(this.REMEMBER_KEY) || localStorage.getItem(this.REMEMBER_KEY)) === 'true' ? localStorage : sessionStorage;
  }

  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.validateSession();
      }
    });
  }

  private validateSession(): void {
    const token = sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.clearSession();
      this.router.navigate(['/login']);
    }
  }

  private initSession(): void {
    try {
      const storedToken = this.storage.getItem(this.TOKEN_KEY);
      const storedUser = this.storage.getItem(this.USER_KEY);

      // Le jeton valide suffit à autoriser la navigation : c'est lui que
      // vérifie isUserLogedAndAccessTokenValid. Exiger aussi la fiche
      // utilisateur déconnectait à chaque rechargement de page dès que
      // celle-ci n'avait pas été persistée — alors même que le jeton
      // restait valide, et clearSession() détruisait ce jeton.
      if (storedToken) {
        const tokenData = JSON.parse(storedToken);
        if (this.isTokenValid(tokenData)) {
          this.isAuthenticatedSubject.next(true);

          // La fiche utilisateur est un confort d'affichage : absente, elle
          // est reconstruite au premier appel de getConnectedUser() (qui
          // repart sur le backend via le jeton).
          if (storedUser) {
            try {
              this.connectedUserSubject.next(JSON.parse(storedUser));
            } catch {
              // fiche illisible : on l'ignore, le jeton reste valable
            }
          }
          return;
        }
      }
    } catch (e) {
      // donnees de session corrompues : on repart d'une session propre
    }

    this.clearSession();
  }

  private isTokenValid(tokenData: AuthenticationResponse): boolean {
    if (!tokenData.accessToken) return false;
    
    try {
      const payload = this.decodeToken(tokenData.accessToken);
      if (payload && payload.exp) {
        return payload.exp * 1000 > Date.now();
      }
      return false;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  login(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authRequest);
  }

  onLoginSuccess(response: AuthenticationResponse, user: UtilisateurDto, rememberMe = false): void {
    localStorage.setItem(this.REMEMBER_KEY, rememberMe ? 'true' : 'false');
    this.storage.setItem(this.TOKEN_KEY, JSON.stringify(response));
    this.storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.connectedUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem(this.REMEMBER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.connectedUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  setAccessToken(authenticationResponse: AuthenticationResponse, rememberMe = false): void {
    localStorage.setItem(this.REMEMBER_KEY, rememberMe ? 'true' : 'false');
    this.storage.setItem(this.TOKEN_KEY, JSON.stringify(authenticationResponse));
  }

  setConnectedUser(utilisateur: UtilisateurDto, rememberMe = false): void {
    localStorage.setItem(this.REMEMBER_KEY, rememberMe ? 'true' : 'false');
    this.storage.setItem(this.USER_KEY, JSON.stringify(utilisateur));
    this.connectedUserSubject.next(utilisateur);
  }

  getConnectedUser(): UtilisateurDto{
    const user = this.connectedUserSubject.value;
    if (user) return user;

    const stored = this.storage.getItem(this.USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.connectedUserSubject.next(parsed);
        return parsed;
      } catch {
        return {} as UtilisateurDto;
      }
    }

    return {} as UtilisateurDto;
  }

  getConnectedUserObservable(): Observable<UtilisateurDto | null> {
    return this.connectedUser$;
  }

  isUserLogedAndAccessTokenValid(): boolean{
    const tokenStr = this.storage.getItem(this.TOKEN_KEY);
    if (!tokenStr) {
      this.router.navigate(['login']);
      return false;
    }
    
    try {
      const data = JSON.parse(tokenStr);
      if (data.accessToken && this.isTokenValid(data)) {
        return true;
      }
    } catch {
      // invalid
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

  updateUtilisateur(utilisateur: UtilisateurDto): Observable<UtilisateurDto>{
    return this.utilisateurService.UtilisateurApiSavePOST(utilisateur);
  }

  findAll(): Observable<UtilisateurDto[]>{
    return this.utilisateurService.UtilisateurApiFindAllGET();
  }

  delete(id: number): Observable<null>{
    return this.utilisateurService.UtilisateurApiDELETE(String(id));
  }

  getToken(): string | null {
    const tokenStr = this.storage.getItem(this.TOKEN_KEY);
    if (!tokenStr) return null;
    
    try {
      const data = JSON.parse(tokenStr);
      return data.accessToken || null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }
}