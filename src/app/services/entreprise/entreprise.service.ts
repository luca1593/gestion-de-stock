import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntrepriseDto } from 'src/gs-api/src/models';
import { EntrepriseService as ApiEntrepriseService } from "src/gs-api/src/services/entreprise.service";

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(
    private entrepriseService: ApiEntrepriseService
  ) { }

  sinscrire(entreprise: EntrepriseDto): Observable<EntrepriseDto> {
    return this.entrepriseService.EntrepriseApiSavePOST(entreprise);
  }

}
