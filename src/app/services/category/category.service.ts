import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { CategoryService as ApiCategoryService } from "src/gs-api/src/services/category.service";
import { CategoryDto } from 'src/gs-api/src/models/category-dto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private userServise: UserService,
    private categoryService: ApiCategoryService
  ) { }

  enregistrer(categoryDto: CategoryDto): Observable<CategoryDto>{
    categoryDto.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.categoryService.CategoryApiSavePOST(categoryDto);
  }

  findAll(): Observable<CategoryDto[]>{
    return this.categoryService.CategoryApiFindAllGET();
  }

  fidById(idCategory: number): Observable<CategoryDto> {
    return this.categoryService.CategoryApiFindByIdGET(idCategory);
  }

  delete(id?: number): Observable<any> {
    if(id){
      return this.categoryService.CategoryApiDeleteDELETE(id);
    }
    return of();
  }
}
