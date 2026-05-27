import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';

@Component({
  selector: 'app-page-utilisateur',
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageUtilisateurComponent implements OnInit, OnDestroy {

  page: number = 1;
  pageSize: number = 5;
  listUtilisateur: Array<UtilisateurDto> = [];
  listUtilisateurFiltre: Array<UtilisateurDto> = [];
  errorMsg = "";
  loading = false;
  private destroy$ = new Subject<void>();

  searchNom: string = '';
  searchEmail: string = '';
  searchAdresse: string = '';
  searchPays: string = '';

  sortState: SortState = { column: 'nom', direction: 'asc' };

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
        this.listUtilisateurFiltre = sortByProperty(list, 'nom', 'asc');
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

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      this.listUtilisateurFiltre = sortByProperty(this.listUtilisateurFiltre, this.sortState.column, this.sortState.direction);
    }
  }

  filtrer(): void {
    this.listUtilisateurFiltre = this.listUtilisateur.filter(user => {
      const matchNom = !this.searchNom || 
        matchSearch(user.nom, this.searchNom) || 
        matchSearch(user.prenom, this.searchNom);
      const matchEmail = !this.searchEmail || matchSearch(user.email, this.searchEmail);
      const matchAdresse = !this.searchAdresse || 
        matchSearch(user.adresse?.adresse1, this.searchAdresse) ||
        matchSearch(user.adresse?.adresse2, this.searchAdresse) ||
        matchSearch(user.adresse?.ville, this.searchAdresse) ||
        matchSearch(user.adresse?.codePostal, this.searchAdresse);
      const matchPays = !this.searchPays || matchSearch(user.adresse?.pays, this.searchPays);
      return matchNom && matchEmail && matchAdresse && matchPays;
    });
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchAdresse = '';
    this.searchPays = '';
    this.listUtilisateurFiltre = this.listUtilisateur;
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  voirDetails(user: UtilisateurDto): void {
    this.router.navigate(["utilisateur", user.id]);
  }

  modifierUtilisateur(user: UtilisateurDto): void {
    this.router.navigate(["modifier-utilisateur", user.id]);
  }

  supprimerUtilisateur(user: UtilisateurDto): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?`)) {
      // Call delete service
    }
  }

}