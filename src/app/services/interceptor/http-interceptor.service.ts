import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LaoderService } from 'src/app/composants/laoder/service/laoder.service';
import { AuthenticationResponse } from 'src/gs-api/src/models';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(
    private laoderService: LaoderService,
    private notificationService: NotificationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.laoderService.show();
    let authenticationResponse: AuthenticationResponse={};
    
    const tokenStr=localStorage.getItem("accessToken");
    if(tokenStr){
      authenticationResponse=JSON.parse(tokenStr);
      if(authenticationResponse.accessToken){
        const authReq=req.clone({
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + authenticationResponse.accessToken
          })
        });
        return this.handelRequest(authReq, next);
      }
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
