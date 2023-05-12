/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
class PhotoService extends __BaseService {

    static readonly PhotoControllerSavePhotoPOSTPath = 'gestiondestock/v1/photos';

    constructor(
      config: __Configuration,
      http: HttpClient
    ) {
      super(config, http);
    }

    /**
   * @return successful operation
   */
  SavePhotoResponse(param: PhotoService.SavePhotoParams): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __formData = new FormData();
    __body = __formData;

    if (param.file != null) {
      __formData.append('file', param.file);
    }

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/photos/${encodeURIComponent(String(param.context))}/${encodeURIComponent(String(param.id))}/${encodeURIComponent(String(param.title))}`,
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
  SavePhoto(params: PhotoService.SavePhotoParams): __Observable<{}> {
    return this.SavePhotoResponse(params).pipe(
      __map(_r => _r.body as {})
    );
  }

}

module PhotoService {

  /**
   * Parameters for savePhoto
   */
  export interface SavePhotoParams {
    title: string;
    id: number;
    file: Blob;
    context: string;
  }
  
}

export { PhotoService  }