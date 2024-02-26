import { Injectable } from '@angular/core';
import { LigneVenteDto, VenteDto } from 'src/gs-api/src/models';
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

  /**
   * @param venteDto
   * @returns Observable<VenteDto>
   */
  enregistrerVente(venteDto: VenteDto): Observable<VenteDto> {
    venteDto.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.apiVenteService.VenteApiSavePOST(venteDto);
  }

  /**
   * @returns Observable<VenteDto[]>
   */
  findAllVente(): Observable<VenteDto[]>{
    return this.apiVenteService.VenteApiFindAllGET();
  }

/**
 * @param idVente
 * @returns Observable<LigneVenteDto[]>
 */
  findLigneVenteByVente(idVente: number): Observable<LigneVenteDto[]>{
    return this.apiVenteService.findAllLigneVenteByVente(idVente);
  }

}
