import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvoirsService as ApiAvoirsService } from 'src/gs-api/src/services/avoirs.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { UserService } from '../user/user.service';

function formatDateForBackend(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()} ${hours}:${minutes}:${seconds}`;
}

@Injectable({
  providedIn: 'root'
})
export class HaveurService {

  constructor(
    private avoirsApi: ApiAvoirsService,
    private userService: UserService
  ) { }

  getAll(): Observable<AvoirDto[]> {
    return this.avoirsApi.AvoirsApiFindAllGET();
  }

  getById(id: number): Observable<AvoirDto> {
    return this.avoirsApi.AvoirsApiFindByIdGET(id);
  }

  getByVente(venteId: number): Observable<AvoirDto[]> {
    return this.avoirsApi.AvoirsApiFindByVenteGET(venteId);
  }

  getByClient(clientId: number): Observable<AvoirDto[]> {
    return this.avoirsApi.AvoirsApiFindByClientGET(clientId);
  }

  getByDateRange(startDate?: string, endDate?: string): Observable<AvoirDto[]> {
    return this.avoirsApi.AvoirsApiFindByDateRangeGET(
      startDate ? formatDateForBackend(startDate) : undefined,
      endDate ? formatDateForBackend(endDate) : undefined
    );
  }

  save(avoir: any): Observable<AvoirDto> {
    // Ajouter l'identreprise depuis l'utilisateur connecté
    const identreprise = this.userService.getConnectedUser()?.entreprise?.id;
    if (identreprise) {
      avoir.identreprise = identreprise;
    }
    console.log('Service - identreprise ajouté:', identreprise);
    console.log('Service - objet complet:', JSON.stringify(avoir));
    return this.avoirsApi.AvoirsApiSavePOST(avoir);
  }

  delete(id: number): Observable<null> {
    return this.avoirsApi.AvoirsApiDELETE(id);
  }
}