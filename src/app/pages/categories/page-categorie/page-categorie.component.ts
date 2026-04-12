import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';

@Component({
  selector: 'app-page-categorie',
  templateUrl: './page-categorie.component.html',
  styleUrls: ['./page-categorie.component.css']
})
export class PageCategorieComponent implements OnInit {

  categoryDtoList: Array<CategoryDto>=[];
  categoryIdToDelete?: number=-1;
  errorMsg: string="";

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.findAllCategory();
  }

  findAllCategory(): void{
    this.categoryService.findAll().subscribe(resp => {
      this.categoryDtoList=resp;
    });
  }

  nouveauCategorie(): void {
    this.router.navigate(["nouvel-categorie"]);
  }

  modiferCategorie(id?: number): void {
    this.router.navigate(["nouvel-categorie", id]);
  }

  openDeleteModal(id: number): void {
    this.categoryIdToDelete = id;
    const modalId = 'modalConfirmDeleteCat';
    this.modalService.openModal(modalId);
  }

  detailsCategorie(): void {
    // Fonctionnalité détails à implémenter si nécessaire
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

  selectCategory(id?: number) {
    this.categoryIdToDelete=id;
  }

  annulerSuppression() {
    this.categoryIdToDelete=-1;
    this.closeDeleteModal();
  }

}
