import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientDto, FournisseurDto } from 'src/gs-api/src/models';
import { ClientService, FournisseurService } from 'src/gs-api/src/services';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CltfrsService {

  constructor(
    private userService: UserService,
    private clientService: ClientService,
    private fournisseurService: FournisseurService
  ) { }

  enregistreClient(clientDTO: ClientDto): Observable<ClientDto>{
    clientDTO.identreprise = this.userService.getConnectedUser().entreprise?.id;
    return this.clientService.SavePOST(clientDTO);
  }

  enregistreFournisseur(fournisseurDto: FournisseurDto): Observable<FournisseurDto>{
    fournisseurDto.identreprise = this.userService.getConnectedUser().entreprise?.id;
    return this.fournisseurService.FournisseurApiSavePOST(fournisseurDto);
  }

  findAllClient():Observable<ClientDto[]>{
    return this.clientService.FindAll();
  }

  findAllFournisseurs():Observable<FournisseurDto[]>{
    return this.fournisseurService.FournisseurApiFindAllGET();
  }

  findClientById(id: number): Observable<ClientDto>{
    return this.clientService.FindById(id);
  }

  findFournisseurById(id: number): Observable<FournisseurDto>{
    return this.fournisseurService.FournisseurApiFindByIdGET(id);
  }

  deleteClient(idClient: number): Observable<any>{
    if(idClient){
      return this.clientService.DeleteDELETE(idClient);
    }
    return of();
  }

  deleteFournisseur(idFournisseur: number): Observable<any>{
    if(idFournisseur){
      return this.fournisseurService.FournisseurApiDeleteDELETE(idFournisseur);
    }
    return of();
  }

}
