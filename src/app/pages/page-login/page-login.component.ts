import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { AuthenticationRequest } from 'src/gs-api/src/models';


@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit, OnDestroy {

  authenticationRequest: AuthenticationRequest={};

  errorMessage="";
  loading=false;
  public isDarkMode = false;
  rememberMe = false;
  submitted = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userServices: UserService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkModeChange$.pipe(takeUntil(this.destroy$)).subscribe(isDark => this.isDarkMode = isDark);
    if (this.userServices.isUserLogedAndAccessTokenValid()) {
      this.router.navigate(['dashbord']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.submitted = true;
    if (!this.authenticationRequest.login || !this.authenticationRequest.password) {
      this.errorMessage="Veuillez entrer votre email et mot de passe";
      return;
    }
    
    this.loading=true;
    this.errorMessage="";
    
    this.userServices.login(this.authenticationRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.userServices.setAccessToken(data, this.rememberMe);
        this.getUserByEmailAndNavigate();
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

  getUserByEmailAndNavigate(): void {
    this.userServices.getUserByEmail(this.authenticationRequest.login).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.userServices.setConnectedUser(user, this.rememberMe);
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['dashbord']);
        }, 100);
      },
      error: () => {
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['dashbord']);
        }, 100);
      }
    });
  }

}
