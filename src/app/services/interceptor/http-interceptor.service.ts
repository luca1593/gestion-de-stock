import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LaoderService } from 'src/app/composants/laoder/service/laoder.service';
import { AuthenticationResponse } from 'src/gs-api/src/models';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(
    private laoderService: LaoderService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.laoderService.show();
    let authenticationResponse: AuthenticationResponse = {};
    if(localStorage.getItem("accessToken")){
      authenticationResponse = JSON.parse(
        localStorage.getItem("accessToken") as string
      );
      const authReq = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + authenticationResponse.accessTokeen
        })
      });
      return this.handelRequest(authReq, next);
    }
    return this.handelRequest(req, next);
  }

  handelRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
          .pipe(tap((event: HttpEvent<any>) => {
            if(event instanceof HttpResponse) {
              this.laoderService.hide();
            }
          }, (erreur: any) => {
            this.laoderService.hide();
          }));
  }

}
