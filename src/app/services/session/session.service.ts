import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthenticationRequest, AuthenticationResponse, ChangerMotDePasseUtilisateurDto, UtilisateurDto } from 'src/gs-api/src/models';
import { AuthenticationService, UtilisateurService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'gs_access_token';
  private readonly USER_KEY = 'gs_user';
  
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
    this.restoreSession();
    this.setupVisibilityHandler();
  }

  private restoreSession(): void {
    try {
      const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
      const storedUser = sessionStorage.getItem(this.USER_KEY);
      
      if (storedToken && storedUser) {
        const tokenData = JSON.parse(storedToken);
        if (this.isTokenValid(tokenData)) {
          const user = JSON.parse(storedUser);
          this.connectedUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          return;
        }
      }
    } catch (e) {
      this.clearSession();
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

  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.validateSession();
      }
    });
  }

  private validateSession(): void {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.clearSession();
      this.router.navigate(['/login']);
    }
  }

  login(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authRequest);
  }

  onLoginSuccess(response: AuthenticationResponse, user: UtilisateurDto): void {
    sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(response));
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    this.connectedUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.connectedUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    const tokenStr = sessionStorage.getItem(this.TOKEN_KEY);
    if (!tokenStr) return null;
    
    try {
      const data = JSON.parse(tokenStr);
      return data.accessToken || null;
    } catch {
      return null;
    }
  }

  getConnectedUser(): UtilisateurDto {
    const user = this.connectedUserSubject.value;
    return user || {} as UtilisateurDto;
  }

  getConnectedUserObservable(): Observable<UtilisateurDto | null> {
    return this.connectedUser$;
  }

  getUserByEmail(email: string): Observable<UtilisateurDto> {
    return this.utilisateurService.UtilisateurApiFindByEmailUtilisateurGET(email);
  }

  updateConnectedUser(user: UtilisateurDto): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.connectedUserSubject.next(user);
  }

  changerMotDePasse(changerMotDePasse: ChangerMotDePasseUtilisateurDto): Observable<ChangerMotDePasseUtilisateurDto> {
    return this.utilisateurService.changerMotDePassePOST(changerMotDePasse);
  }
}