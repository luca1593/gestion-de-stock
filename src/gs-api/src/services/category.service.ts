/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CategoryDto } from '../models/category-dto';
@Injectable({
  providedIn: 'root',
})
class CategoryService extends __BaseService {
  static readonly CategoryApiFindByCodeCategoryGETPath = 'gestiondestock/v1/category/code/{codeCategory}';

  static readonly CategoryApiFindAllGETPath = 'gestiondestock/v1/category/all';
  static readonly CategoryApiSavePOSTPath = 'gestiondestock/v1/category/create';
  static readonly CategoryApiDeleteDELETEPath = 'gestiondestock/v1/category/detele/{idCategory}';
  static readonly CategoryApiFindByIdGETPath = 'gestiondestock/v1/category/{idCategory}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Rechercher une categorie
   *
   * Cette methode permet de rechercher une categorie par son code
   * @param codeCategory undefined
   * @return L'objet categorie a ete trouver dans la BDD
   */
  CategoryApiFindByCodeCategoryGETResponse(codeCategory: string): __Observable<__StrictHttpResponse<CategoryDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/category/code/${encodeURIComponent(String(codeCategory))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryDto>;
      })
    );
  }
  /**
   * Rechercher une categorie
   *
   * Cette methode permet de rechercher une categorie par son code
   * @param codeCategory undefined
   * @return L'objet categorie a ete trouver dans la BDD
   */
  CategoryApiFindByCodeCategoryGET(codeCategory: string): __Observable<CategoryDto> {
    return this.CategoryApiFindByCodeCategoryGETResponse(codeCategory).pipe(
      __map(_r => _r.body as CategoryDto)
    );
  }

  /**
   * Renvoie la liste des categories
   *
   * Cette methode permet de rechercher toutes les categories dans la BDD
   * @return La liste des categories / liste vide
   */
   CategoryApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<CategoryDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/category/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CategoryDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des categories
   *
   * Cette methode permet de rechercher toutes les categories dans la BDD
   * @return La liste des categories / liste vide
   */
  CategoryApiFindAllGET(): __Observable<Array<CategoryDto>> {
    return this.CategoryApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<CategoryDto>)
    );
  }

  /**
   * Enregistrement d'une categorie
   *
   * Cette methode permet d'enregidtre ou de modifier une categorie
   * @return L'objet categorie creer ou modifier
   */
  CategoryApiSavePOSTResponse(body?: CategoryDto): __Observable<__StrictHttpResponse<CategoryDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/category/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryDto>;
      })
    );
  }
  /**
   * Enregistrement d'une categorie
   *
   * Cette methode permet d'enregidtre ou de modifier une categorie
   * @return L'objet categorie creer ou modifier
   */
  CategoryApiSavePOST(body?: CategoryDto): __Observable<CategoryDto> {
    return this.CategoryApiSavePOSTResponse(body).pipe(
      __map(_r => _r.body as CategoryDto)
    );
  }

  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un categorie par son ID
   */
  CategoryApiDeleteDELETEResponse(idCategory: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/category/detele/${encodeURIComponent(String(idCategory))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un categorie par son ID
   */
  CategoryApiDeleteDELETE(idCategory: number): __Observable<null> {
    return this.CategoryApiDeleteDELETEResponse(idCategory).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher une categorie
   *
   * Cette methode permet de rechercher une categorie par son ID
   * @return L'objet categorie a ete trouver dans la BDD
   */
  CategoryApiFindByIdGETResponse(idCategory?: number): __Observable<__StrictHttpResponse<CategoryDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/category/${encodeURIComponent(String(idCategory))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryDto>;
      })
    );
  }
  /**
   * Rechercher une categorie
   *
   * Cette methode permet de rechercher une categorie par son ID
   * @return L'objet categorie a ete trouver dans la BDD
   */
  CategoryApiFindByIdGET(idCategory?: number  ): __Observable<CategoryDto> {
    return this.CategoryApiFindByIdGETResponse(idCategory).pipe(
      __map(_r => _r.body as CategoryDto)
    );
  }

}

module CategoryService {
}

export { CategoryService }
