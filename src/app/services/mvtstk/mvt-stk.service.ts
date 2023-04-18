import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MvtStkDto } from 'src/gs-api/src/models';
import { MvtstkService } from 'src/gs-api/src/services';

@Injectable({
  providedIn: 'root'
})
export class MvtStkService {

  constructor(
    private mvtStkService: MvtstkService
  ) { }

  findAll(): Observable<MvtStkDto[]>{
    return this.mvtStkService.MvtStkApiFindAllGET();
  }

  fidByID(idMvtStk: number): Observable<MvtStkDto>{
    return this.mvtStkService.MvtStkApiFindByIdGET(idMvtStk);
  }

  findAllMvtByArticle(idArticle: number): Observable<MvtStkDto[]>{
    return this.mvtStkService.MvtStkApiMvtStkArticleGET(idArticle);
  }
}
