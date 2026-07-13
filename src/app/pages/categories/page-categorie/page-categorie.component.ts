import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { CategoryDto, ArticleDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';
import { forkJoin, of, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-page-categorie',
  templateUrl: './page-categorie.component.html',
  styleUrls: ['./page-categorie.component.css']
})
export class PageCategorieComponent implements OnInit {

  categoryDtoList: Array<CategoryDto> = [];
  categoryDtoListFiltre: Array<CategoryDto> = [];
  categoryIdToDelete?: number = -1;
  errorMsg: string = "";
  loading = true;
page: number = 1;
  pageSize: number = 5;
  categorieSelectionnee?: CategoryDto;
  articlesCategorie: ArticleDto[] = [];
  articlesPage: number = 1;
  articlesPageSize: number = 5;

  sortState: SortState = { column: '', direction: 'asc' };

  searchCode: string = '';
  searchDesignation: string = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private articleService: ArtcleService,
    private exportService: ExportExcelService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.findAllCategory();
  }

  findAllCategory(): void {
    this.loading = true;
    this.categoryService.findAll().subscribe({
      next: (resp) => {
        this.categoryDtoList = resp;
        this.categoryDtoListFiltre = resp;
        this.applySort();
        this.loading = false;
      },
      error: () => {
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
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      this.categoryDtoListFiltre = sortByProperty(this.categoryDtoListFiltre, this.sortState.column, this.sortState.direction);
    }
  }

  filtrer(): void {
    this.categoryDtoListFiltre = this.categoryDtoList.filter(cat => {
      const matchCode = !this.searchCode || matchSearch(cat.code, this.searchCode);
      const matchDesignation = !this.searchDesignation || matchSearch(cat.designation, this.searchDesignation);
      return matchCode && matchDesignation;
    });
    this.applySort();
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchDesignation = '';
    this.categoryDtoListFiltre = this.categoryDtoList;
    this.applySort();
    this.page = 1;
  }

  nouveauCategorie(): void {
    this.router.navigate(["nouvel-categorie"]);
  }

  modiferCategorie(id?: number): void {
    this.router.navigate(["nouvel-categorie", id]);
  }

  voirDetails(category: CategoryDto): void {
    this.categorieSelectionnee = category;
    this.articlesPage = 1;
    if (category.id) {
      this.articleService.findArticlesByCategory(category.id).subscribe({
        next: (articles) => {
          this.articlesCategorie = articles;
        },
        error: () => {
          this.articlesCategorie = [];
        }
      });
    }
    this.modalService.openModal('modalDetailCat');
  }

  openDeleteModal(id: number): void {
    this.categoryIdToDelete = id;
    const modalId = 'modalConfirmDeleteCat';
    this.modalService.openModal(modalId);
  }

  supprimerCategorie() {
    if (this.categoryIdToDelete && this.categoryIdToDelete !== -1) {
      this.categoryService.delete(this.categoryIdToDelete).subscribe({
        next: () => {
          this.findAllCategory();
          this.categoryIdToDelete = -1;
          this.closeDeleteModal();
          this.notificationService.addSuccess('Succès', 'Catégorie supprimée avec succès');
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Une erreur est survenue';
          this.notificationService.addError('Erreur', this.errorMsg);
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    const modalId = 'modalConfirmDeleteCat';
    this.modalService.closeModal(modalId);
  }

  annulerSuppression() {
    this.categoryIdToDelete = -1;
    this.closeDeleteModal();
  }

  exporterCategories(): void {
    this.exportService.exportCategories(this.categoryDtoList);
  }

  async importerCategories(event: any): Promise<void> {
    const file: File = event.target.files?.[0];
    if (!file) return;
    this.loading = true;
    this.errorMsg = '';

    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const ws = workbook.getWorksheet(1);
      if (!ws) {
        this.notificationService.addError('Import', 'Fichier Excel invalide');
        this.loading = false;
        return;
      }

      const observables: any[] = [];
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const code = row.getCell(1).text?.trim();
        const designation = row.getCell(2).text?.trim();
        if (!code && !designation) return;

        const dto: CategoryDto = { code: code || undefined, designation: designation || undefined };
        observables.push(
          this.categoryService.enregistrer(dto).pipe(
            catchError(() => of(null))
          )
        );
      });

      if (observables.length === 0) {
        this.notificationService.addWarning('Import', 'Aucune ligne valide trouvée dans le fichier');
        this.loading = false;
        return;
      }

      const results = await firstValueFrom(forkJoin(observables));
      const imported = results.filter(r => r !== null).length;

      this.notificationService.addSuccess('Import', `${imported} catégorie(s) importée(s) avec succès`);
      this.findAllCategory();
    } catch (err) {
      this.errorMsg = 'Erreur lors de la lecture du fichier';
      this.notificationService.addError('Import', this.errorMsg);
    } finally {
      this.loading = false;
      event.target.value = '';
    }
  }

}