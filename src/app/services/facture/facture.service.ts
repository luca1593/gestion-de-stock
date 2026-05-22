import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface FactureDto {
  id?: number;
  numeroFacture?: string;
  dateFacture?: string;
  dateEcheance?: string;
  statut?: string;
  montantHT?: number;
  montantTVA?: number;
  montantTTC?: number;
  montantPaye?: number;
  montantRestant?: number;
  clientId?: number;
  clientNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = `${environment.apiUrl}v1/factures`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<FactureDto[]> {
    return this.http.get<FactureDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<FactureDto> {
    return this.http.get<FactureDto>(`${this.apiUrl}/${id}`);
  }

  findByClient(clientId: number): Observable<FactureDto[]> {
    return this.http.get<FactureDto[]>(`${this.apiUrl}/client/${clientId}`);
  }

  findByEntreprise(entrepriseId: number): Observable<FactureDto[]> {
    return this.http.get<FactureDto[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  findByStatut(statut: string): Observable<FactureDto[]> {
    return this.http.get<FactureDto[]>(`${this.apiUrl}/statut/${statut}`);
  }

  save(facture: FactureDto): Observable<FactureDto> {
    facture.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<FactureDto>(`${this.apiUrl}/save`, facture);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
