import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, interval } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private tokenExpirationWarningSubject = new BehaviorSubject<boolean>(false);
  tokenExpirationWarning$ = this.tokenExpirationWarningSubject.asObservable();

  private readonly WARNING_TIME = 5 * 60 * 1000;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.startTokenMonitoring();
  }

  private startTokenMonitoring(): void {
    interval(10000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.isTokenPresent())
      )
      .subscribe(() => {
        const tokenExp = this.getTokenExpiration();
        if (tokenExp) {
          const now = Date.now();
          const timeUntilExp = tokenExp - now;

          if (timeUntilExp <= 0) {
            this.logout();
          } else if (timeUntilExp <= this.WARNING_TIME && !this.tokenExpirationWarningSubject.value) {
            this.tokenExpirationWarningSubject.next(true);
          } else if (timeUntilExp > this.WARNING_TIME && this.tokenExpirationWarningSubject.value) {
            this.tokenExpirationWarningSubject.next(false);
          }
        }
      });
  }

  private isTokenPresent(): boolean {
    const tokenStr = sessionStorage.getItem('gs_access_token');
    if (!tokenStr) return false;
    
    try {
      const authResponse = JSON.parse(tokenStr);
      return !!authResponse.accessToken;
    } catch {
      return false;
    }
  }

  private getTokenExpiration(): number | null {
    const tokenStr = sessionStorage.getItem('gs_access_token');
    if (!tokenStr) return null;
    
    try {
      const authResponse = JSON.parse(tokenStr);
      const token = authResponse.accessToken;
      if (!token) return null;
      
      const payload = this.decodeToken(token);
      if (payload && payload.exp) {
        return payload.exp * 1000;
      }
      return null;
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  logout(): void {
    this.tokenExpirationWarningSubject.next(false);
    this.userService.logout();
  }

  dismissWarning(): void {
    this.tokenExpirationWarningSubject.next(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}