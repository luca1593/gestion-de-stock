import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface RegleTarifaireDto {
  id?: number;
  code?: string;
  nom?: string;
  description?: string;
  typeRegle?: string;
  valeur?: number;
  estActif?: boolean;
  dateDebut?: string;
  dateFin?: string;
  quantiteMinimale?: number;
  montantMinimal?: number;
  entrepriseId?: number;
  entrepriseNom?: string;
  categorieId?: number;
  categorieDesignation?: string;
  clientId?: number;
  clientNom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegleTarifaireService {
  private apiUrl = `${environment.apiUrl}v1/regles-tarifaires`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  findAll(): Observable<RegleTarifaireDto[]> {
    return this.http.get<RegleTarifaireDto[]>(`${this.apiUrl}/all`);
  }

  findById(id: number): Observable<RegleTarifaireDto> {
    return this.http.get<RegleTarifaireDto>(`${this.apiUrl}/${id}`);
  }

  findActifs(): Observable<RegleTarifaireDto[]> {
    return this.http.get<RegleTarifaireDto[]>(`${this.apiUrl}/actifs`);
  }

  findByEntreprise(entrepriseId: number): Observable<RegleTarifaireDto[]> {
    return this.http.get<RegleTarifaireDto[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  findByCategorie(categorieId: number): Observable<RegleTarifaireDto[]> {
    return this.http.get<RegleTarifaireDto[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }

  save(regle: RegleTarifaireDto): Observable<RegleTarifaireDto> {
    regle.entrepriseId = this.userService.getConnectedUser()?.entreprise?.id;
    return this.http.post<RegleTarifaireDto>(`${this.apiUrl}/save`, regle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
