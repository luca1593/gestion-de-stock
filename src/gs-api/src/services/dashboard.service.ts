/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { DashboardRequest, DashboardResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
class DashboardService extends __BaseService {
  static readonly savePath = 'gestiondestock/v1/dashbaord/story';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Dashboard story
   *
   * Cette methode permet de recuperer l'historique les données globale
   * @param body DashboardRequest
   * @return List des données selon l'intérvale de date / Aucune données n'a été trouvé
   */
  getDasboardDataResponse(body: DashboardRequest): __Observable<__StrictHttpResponse<DashboardResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/dashbaord/story`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DashboardResponse>;
      })
    );
  }

  /**
   * Dashboard story
   *
   * Cette methode permet de recuperer l'historique les données globale
   * @param body DashboardRequest
   * @return List des données selon l'intérvale de date / Aucune données n'a été trouvé
   */
  getDasboardData(body: DashboardRequest): __Observable<DashboardResponse> {
    return this.getDasboardDataResponse(body).pipe(
      __map(_r => _r.body as DashboardResponse)
    );
  }
}

module DashboardService {
}

export { DashboardService }
