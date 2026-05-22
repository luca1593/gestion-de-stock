import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CategoryDto, ArticleDto } from 'src/gs-api/src/models';

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

  searchCode: string = '';
  searchDesignation: string = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private articleService: ArtcleService
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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filtrer(): void {
    this.categoryDtoListFiltre = this.categoryDtoList.filter(cat => {
      const matchCode = !this.searchCode || (cat.code?.toLowerCase().includes(this.searchCode.toLowerCase()));
      const matchDesignation = !this.searchDesignation || (cat.designation?.toLowerCase().includes(this.searchDesignation.toLowerCase()));
      return matchCode && matchDesignation;
    });
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchDesignation = '';
    this.categoryDtoListFiltre = this.categoryDtoList;
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