import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilisateurDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-page-utilisateur',
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.css'],
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
    private notificationService: NotificationService
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
    this.userService.findAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (list) => {
        this.listUtilisateur = list;
        this.listUtilisateurFiltre = sortByProperty(list, 'nom', 'asc');
        this.loading = false;
      },
      error: (error) => {
        this.errorMsg = error.error?.error || 'Erreur lors du chargement';
        this.loading = false;
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
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchAdresse = '';
    this.searchPays = '';
    this.listUtilisateurFiltre = this.listUtilisateur;
    this.applySort();
    this.page = 1;
  }

  voirDetails(user: UtilisateurDto): void {
    this.router.navigate(["utilisateur", user.id]);
  }

  modifierUtilisateur(user: UtilisateurDto): void {
    this.router.navigate(["modifier-utilisateur", user.id]);
  }

  supprimerUtilisateur(user: UtilisateurDto): void {
    if (!user.id) return;
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?`)) {
      this.userService.delete(user.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.findAllUtilisateur();
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Erreur lors de la suppression';
        }
      });
    }
  }

  exporterUtilisateurs(): void {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Gestion de Stock';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('Utilisateurs');
    ws.columns = [
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Rôle', key: 'role', width: 15 },
      { header: 'Adresse', key: 'adresse', width: 30 },
      { header: 'Ville', key: 'ville', width: 15 },
      { header: 'Pays', key: 'pays', width: 15 },
    ];

    this.listUtilisateur.forEach(u => {
      ws.addRow({
        nom: u.nom || '',
        prenom: u.prenom || '',
        email: u.email || '',
        role: u.roles?.[0]?.roleNom || '',
        adresse: u.adresse?.adresse1 || '',
        ville: u.adresse?.ville || '',
        pays: u.adresse?.pays || '',
      });
    });

    ws.getRow(1).font = { bold: true };
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'utilisateurs_' + new Date().toISOString().split('T')[0] + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      this.notificationService.addSuccess('Succès', 'Export terminé');
    });
  }

  async importerUtilisateurs(event: any): Promise<void> {
    const file: File = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const ws = workbook.getWorksheet(1);
      if (!ws) {
        this.notificationService.addError('Erreur', 'Fichier Excel invalide');
        return;
      }

      const rows: UtilisateurDto[] = [];
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const nom = String(row.getCell(1).text || '').trim();
        const prenom = String(row.getCell(2).text || '').trim();
        const email = String(row.getCell(3).text || '').trim();
        if (!nom || !email) return;
        rows.push({
          nom,
          prenom,
          email,
          motDePasse: 'default123',
          adresse: {
            adresse1: String(row.getCell(5).text || '').trim(),
            ville: String(row.getCell(6).text || '').trim(),
            pays: String(row.getCell(7).text || '').trim(),
          }
        });
      });

      if (rows.length === 0) {
        this.notificationService.addError('Erreur', 'Aucune donnée trouvée');
        return;
      }

      let imported = 0;
      let errors = 0;
      for (const dto of rows) {
        try {
          await firstValueFrom(this.userService.updateUtilisateur(dto));
          imported++;
        } catch {
          errors++;
        }
      }

      if (errors > 0) {
        this.notificationService.addWarning('Attention', `${imported} importé(s), ${errors} erreur(s)`);
      } else {
        this.notificationService.addSuccess('Succès', `${imported} utilisateur(s) importé(s)`);
      }
      this.findAllUtilisateur();
    } catch {
      this.notificationService.addError('Erreur', 'Échec de la lecture du fichier');
    }
  }
}