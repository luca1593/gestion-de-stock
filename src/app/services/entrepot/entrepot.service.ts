import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface EntrepotDto {
  id?: number;
  code?: string;
  nom?: string;
  description?: string;
  adresse?: any;
  estPrincipal?: boolean;
  entrepriseId?: number;
  entrepriseNom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntrepotService {
  private apiUrl = `${environment.apiUrl}v1/entrepots`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<EntrepotDto[]> {
    return this.http.get<EntrepotDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<EntrepotDto> {
    return this.http.get<EntrepotDto>(`${this.apiUrl}/${id}`);
  }

  findByEntreprise(entrepriseId: number): Observable<EntrepotDto[]> {
    return this.http.get<EntrepotDto[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  save(entrepot: EntrepotDto): Observable<EntrepotDto> {
    entrepot.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<EntrepotDto>(`${this.apiUrl}/save`, entrepot);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
