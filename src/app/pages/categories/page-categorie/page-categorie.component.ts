import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CategoryDto, ArticleDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';

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

}