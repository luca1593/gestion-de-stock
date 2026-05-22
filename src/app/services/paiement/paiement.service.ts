import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface PaiementDto {
  id?: number;
  montant?: number;
  datePaiement?: string;
  modePaiement?: string;
  reference?: string;
  note?: string;
  factureId?: number;
  factureNumero?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = `${environment.apiUrl}v1/paiements`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<PaiementDto[]> {
    return this.http.get<PaiementDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<PaiementDto> {
    return this.http.get<PaiementDto>(`${this.apiUrl}/${id}`);
  }

  findByFacture(factureId: number): Observable<PaiementDto[]> {
    return this.http.get<PaiementDto[]>(`${this.apiUrl}/facture/${factureId}`);
  }

  save(paiement: PaiementDto): Observable<PaiementDto> {
    paiement.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<PaiementDto>(`${this.apiUrl}/save`, paiement);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
