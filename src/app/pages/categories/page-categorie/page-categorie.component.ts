import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';

@Component({
  selector: 'app-page-categorie',
  templateUrl: './page-categorie.component.html',
  styleUrls: ['./page-categorie.component.css']
})
export class PageCategorieComponent implements OnInit {

  categoryDtoList: Array<CategoryDto> = [];
  categoryIdToDelete?: number = -1;
  errorMsg: string = "";

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findAllCategory();
  }

  findAllCategory(): void{
    this.categoryService.findAll().subscribe(resp => {
      this.categoryDtoList = resp;
    });
  }

  nouveauCategorie(): void {
    this.router.navigate(["nouvel-categorie"]);
  }

  modiferCategorie(id?: number): void {
    this.router.navigate(["nouvel-categorie", id]);
  }

  supprimerCategorie() {
    if(this.categoryIdToDelete !== -1){
      this.categoryService.delete(this.categoryIdToDelete).subscribe( resp => {
        this.findAllCategory();
        this.categoryIdToDelete = -1;
      }, error => {
        this.errorMsg = error.error.message;
      });
    }
  }

  selectCategory(id?: number) {
    this.categoryIdToDelete = id;
  }

  annulerSuppression() {
    this.categoryIdToDelete = -1;
  }

}
