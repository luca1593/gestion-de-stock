import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface LotDto {
  id?: number;
  numeroLot?: string;
  quantite?: number;
  quantiteRestante?: number;
  dateFabrication?: string;
  dateExpiration?: string;
  prixAchat?: number;
  articleId?: number;
  articleDesignation?: string;
  entrepotId?: number;
  entrepotNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
  estCompletementUtilise?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = `${environment.apiUrl}v1/lots`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<LotDto[]> {
    return this.http.get<LotDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<LotDto> {
    return this.http.get<LotDto>(`${this.apiUrl}/${id}`);
  }

  findByArticle(articleId: number): Observable<LotDto[]> {
    return this.http.get<LotDto[]>(`${this.apiUrl}/article/${articleId}`);
  }

  findByEntrepot(entrepotId: number): Observable<LotDto[]> {
    return this.http.get<LotDto[]>(`${this.apiUrl}/entrepot/${entrepotId}`);
  }

  findAvailable(): Observable<LotDto[]> {
    return this.http.get<LotDto[]>(`${this.apiUrl}/available`);
  }

  save(lot: LotDto): Observable<LotDto> {
    lot.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<LotDto>(`${this.apiUrl}/save`, lot);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
