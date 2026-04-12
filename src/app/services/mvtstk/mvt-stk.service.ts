import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MvtStkDto, ArticleDto } from 'src/gs-api/src/models';

@Injectable({
  providedIn: 'root'
})
export class MvtStkService {

  private articlesStock: Map<number, number> = new Map();
  private apiUrl = 'http://12.24.5.100:8085/v1/mvtstk';

  constructor(
    private http: HttpClient
  ) { }

  findAll(): Observable<MvtStkDto[]>{
    return this.http.get<MvtStkDto[]>(`${this.apiUrl}/all`);
  }

  fidByID(idMvtStk: number): Observable<MvtStkDto>{
    return this.http.get<MvtStkDto>(`${this.apiUrl}/${idMvtStk}`);
  }

  findAllMvtByArticle(idArticle: number): Observable<MvtStkDto[]>{
    return this.http.get<MvtStkDto[]>(`${this.apiUrl}/filter/article/${idArticle}`);
  }

  setArticleStock(idArticle: number, stock: number): void {
    this.articlesStock.set(idArticle, stock);
  }

  corregerStock(idArticle: number, newStock: number): Observable<MvtStkDto> {
    const currentStock = this.articlesStock.get(idArticle) || 0;
    const diff = newStock - currentStock;
    
    if (diff === 0) {
      return of({} as MvtStkDto);
    }

    const isPositive = diff > 0;
    const endpoint = isPositive ? 'correction-pos' : 'correction-neg';
    const typeMvt = isPositive ? 'CORRECTION_POS' : 'CORRECTION_NEG';

    const body = {
      article: { id: idArticle } as ArticleDto,
      quantite: Math.abs(diff),
      dateMvt: Date.now(),
      typeMvt: typeMvt
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<MvtStkDto>(`${this.apiUrl}/${endpoint}`, body, { headers }).pipe(
      map(response => {
        this.articlesStock.set(idArticle, newStock);
        return response;
      })
    );
  }
}
