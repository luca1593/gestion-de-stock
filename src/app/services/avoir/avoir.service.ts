import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvoirsService as ApiAvoirsService } from 'src/gs-api/src/services/avoirs.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { UserService } from '../user/user.service';

function formatDateForBackend(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
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
    if (avoir.dateAvoir) {
      avoir.dateAvoir = formatDateForBackend(avoir.dateAvoir);
    }
    const identreprise = this.userService.getConnectedUser()?.entreprise?.id;
    if (identreprise) {
      avoir.identreprise = identreprise;
    }
    return this.avoirsApi.AvoirsApiSavePOST(avoir);
  }

  delete(id: number): Observable<null> {
    return this.avoirsApi.AvoirsApiDELETE(id);
  }
}