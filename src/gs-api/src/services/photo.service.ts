/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { SavePhotoParams } from '../models/save-photo-params';

@Injectable({
    providedIn: 'root',
})
class PhotoService extends __BaseService {

    static readonly PhotoControllerSavePhotoPOSTPath = 'gestiondestock/v1/photos/{id}/{title}/{context}';

    constructor(
      config: __Configuration,
      http: HttpClient
    ) {
      super(config, http);
    }

    /**
   * @return successful operation
   */
  SavePhotoResponse(params: SavePhotoParams): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __formData = new FormData();
    __body = __formData;

    if (params != null) {
      __formData.append('file', params.file as string | Blob);
    }

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/photos/${encodeURIComponent(String(params.id))}/${encodeURIComponent(String(params.title))}/${encodeURIComponent(String(params.context))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{}>;
      })
    );
  }
  /**
   * @return successful operation
   */
  SavePhoto(params: SavePhotoParams): __Observable<{}> {
    return this.SavePhotoResponse(params).pipe(
      __map(_r => _r.body as {})
    );
  }

}

module PhotoService {
}

export { PhotoService  }