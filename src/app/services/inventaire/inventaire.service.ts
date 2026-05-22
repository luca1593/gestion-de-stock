import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface InventaireLigneDto {
  id?: number;
  inventaireId?: number;
  articleId?: number;
  articleDesignation?: string;
  quantiteTheorique?: number;
  quantiteReelle?: number;
}

export interface InventaireDto {
  id?: number;
  code?: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  statut?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
  entrepotId?: number;
  entrepotNom?: string;
  lignes?: InventaireLigneDto[];
}

@Injectable({
  providedIn: 'root'
})
export class InventaireService {
  private apiUrl = `${environment.apiUrl}v1/inventaires`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<InventaireDto[]> {
    return this.http.get<InventaireDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<InventaireDto> {
    return this.http.get<InventaireDto>(`${this.apiUrl}/${id}`);
  }

  findByEntrepot(entrepotId: number): Observable<InventaireDto[]> {
    return this.http.get<InventaireDto[]>(`${this.apiUrl}/entrepot/${entrepotId}`);
  }

  findByEntreprise(entrepriseId: number): Observable<InventaireDto[]> {
    return this.http.get<InventaireDto[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  findByStatut(statut: string): Observable<InventaireDto[]> {
    return this.http.get<InventaireDto[]>(`${this.apiUrl}/statut/${statut}`);
  }

  save(inventaire: InventaireDto): Observable<InventaireDto> {
    inventaire.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<InventaireDto>(`${this.apiUrl}/save`, inventaire);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
