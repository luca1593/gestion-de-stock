import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';

@Component({
  selector: 'app-nouveau-categorie',
  templateUrl: './nouveau-categorie.component.html',
  styleUrls: ['./nouveau-categorie.component.css']
})
export class NouveauCategorieComponent implements OnInit {

  categoryDto: CategoryDto = {};
  errorMsg : Array<string> = [];

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private categoryService: CategoryService
    ) { }

  ngOnInit(): void {
    const idCategory = this.activatedRouter.snapshot.params['idCategory'];
    if(idCategory){
      this.categoryService.fidById(idCategory).subscribe(resp =>{
        this.categoryDto = resp;
      });
    }
  }

  saveClick(): void {
    this.categoryService.enregistrer(this.categoryDto).subscribe(resp =>{
      this.router.navigate(["categories"]);
    }, error => {
      this.errorMsg = error.error.errors;
    });
  }

  cancelClick(): void {
    this.router.navigate(["categories"]);
  }

}
