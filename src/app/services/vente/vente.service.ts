import { Injectable } from '@angular/core';
import { VenteDto } from 'src/gs-api/src/models';
import { VenteService as ApiVenteService } from 'src/gs-api/src/services';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  constructor(
    private apiVenteService: ApiVenteService,
    private userServise: UserService
  ) { }

  enregistrerVente(venteDto: VenteDto): Observable<VenteDto> {
    venteDto.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.apiVenteService.VenteApiSavePOST(venteDto);
  }

  findAllVente(idCmd?: number): Observable<VenteDto[]>{
    return this.apiVenteService.VenteApiFindAllGET();
  }

}
