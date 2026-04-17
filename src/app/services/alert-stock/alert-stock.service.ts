import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertStockService as ApiAlertStockService } from 'src/gs-api/src/services/alert-stock.service';
import { AlertStockDto } from 'src/gs-api/src/models';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AlertStockService {

  constructor(
    private alertStockApi: ApiAlertStockService,
    private userService: UserService
  ) { }

  getAlertesActives(): Observable<AlertStockDto[]> {
    const identreprise = this.userService.getConnectedUser()?.entreprise?.id;
    if (!identreprise) {
      return new Observable(subscriber => subscriber.next([]));
    }
    return this.alertStockApi.AlertStockApiFindActivesGET(identreprise);
  }

  getAlertesByNiveau(niveau: string): Observable<AlertStockDto[]> {
    return this.alertStockApi.AlertStockApiFindByNiveauGET(niveau);
  }

  saveAlerte(alerte: AlertStockDto): Observable<AlertStockDto> {
    return this.alertStockApi.AlertStockApiSavePOST(alerte);
  }

  deleteAlerte(id: number): Observable<null> {
    return this.alertStockApi.AlertStockApiDELETE(id);
  }
}