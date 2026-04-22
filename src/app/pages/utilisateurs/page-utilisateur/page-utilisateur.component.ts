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

  page: number = 1;
  pageSize: number = 10;
  listUtilisateur: Array<UtilisateurDto> = [];
  listUtilisateurFiltre: Array<UtilisateurDto> = [];
  errorMsg = "";
  loading = false;
  private destroy$ = new Subject<void>();

  searchNom: string = '';
  searchEmail: string = '';
  searchEntreprise: string = '';

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

  nouveauUtilisateur(): void {
    this.router.navigate(["nouvel-utilisateur"]);
  }

  findAllUtilisateur() {
    this.loading = true;
    this.cdr.markForCheck();
    this.userService.findAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (list) => {
        this.listUtilisateur = list;
        this.listUtilisateurFiltre = list;
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

  filtrer(): void {
    this.listUtilisateurFiltre = this.listUtilisateur.filter(user => {
      const matchNom = !this.searchNom || 
        (user.nom?.toLowerCase().includes(this.searchNom.toLowerCase())) || 
        (user.prenom?.toLowerCase().includes(this.searchNom.toLowerCase()));
      const matchEmail = !this.searchEmail || (user.email?.toLowerCase().includes(this.searchEmail.toLowerCase()));
      const matchEntreprise = !this.searchEntreprise || (user.entreprise?.nom?.toLowerCase().includes(this.searchEntreprise.toLowerCase()));
      return matchNom && matchEmail && matchEntreprise;
    });
    this.page = 1;
    this.cdr.markForCheck();
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchEntreprise = '';
    this.listUtilisateurFiltre = this.listUtilisateur;
    this.page = 1;
    this.cdr.markForCheck();
  }

  voirDetails(user: UtilisateurDto): void {
    // Navigate to details or open modal
  }

  modifierUtilisateur(user: UtilisateurDto): void {
    this.router.navigate(["nouvel-utilisateur", user.id]);
  }

  supprimerUtilisateur(user: UtilisateurDto): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?`)) {
      // Call delete service
    }
  }

}