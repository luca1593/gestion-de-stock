import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface TransfertStockDto {
  id?: number;
  code?: string;
  dateTransfert?: string;
  statut?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
  entrepotSourceId?: number;
  entrepotSourceNom?: string;
  entrepotDestinationId?: number;
  entrepotDestinationNom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransfertStockService {
  private apiUrl = `${environment.apiUrl}v1/transferts`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<TransfertStockDto[]> {
    return this.http.get<TransfertStockDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<TransfertStockDto> {
    return this.http.get<TransfertStockDto>(`${this.apiUrl}/${id}`);
  }

  findByEntreprise(entrepriseId: number): Observable<TransfertStockDto[]> {
    return this.http.get<TransfertStockDto[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  findByStatut(statut: string): Observable<TransfertStockDto[]> {
    return this.http.get<TransfertStockDto[]>(`${this.apiUrl}/statut/${statut}`);
  }

  save(transfert: TransfertStockDto): Observable<TransfertStockDto> {
    transfert.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<TransfertStockDto>(`${this.apiUrl}/save`, transfert);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
