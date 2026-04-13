import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-utilisateur',
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageUtilisateurComponent implements OnInit, OnDestroy {

  page: number=1;
  listUtilisateur: Array<UtilisateurDto>=[];
  errorMsg="";
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.findAllUtilisateur();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nouveauUtilisteur(): void {
    this.router.navigate(["nouvel-utilisateur"]);
  }

  findAllUtilisateur(){
    this.loading = true;
    this.cdr.markForCheck();
    this.userService.findAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (list) => {
        this.listUtilisateur = list;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMsg = error.error?.error || 'Erreur lors du chargement';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

}
