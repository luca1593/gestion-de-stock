import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientDto, CommandeClientDto, CommandeFournisseurDto, FournisseurDto, LigneCommandeClientDto, LigneCommandeFournisseurDto } from 'src/gs-api/src/models';
import { CommandeClientService, CommandeFournisseurService } from 'src/gs-api/src/services';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CmdCltFrsService {

  constructor(
    private commandeClientService: CommandeClientService,
    private commandeFournisseurService: CommandeFournisseurService,
    private userServise: UserService
  ) { }

  enregistrerCommandeClient(commandeClientDTO: CommandeClientDto, date: number): Observable<CommandeClientDto> {
    commandeClientDTO.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.commandeClientService.CommandeClientApiSavePOST(commandeClientDTO, date);
    
  }

  enregistrerCommandeFournisseur(commandeFournisseurDTO: CommandeFournisseurDto, date: number):Observable<CommandeFournisseurDto> {
    commandeFournisseurDTO.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.commandeFournisseurService.save(commandeFournisseurDTO, date);
  }

  findAllCommandeClient(): Observable<CommandeClientDto[]>{
    return this.commandeClientService.CommandeClientApiFindAllGET();
  }

  findAllCommandeFournisseur(): Observable<CommandeFournisseurDto[]>{
    return this.commandeFournisseurService.CommandeFournisseurApiFindAllGET();
  }

  findAllLigneCommandeClient(idCmd?: number): Observable<LigneCommandeClientDto[]>{
    if(idCmd){
      return this.commandeClientService.findAllLigneCommadeByCommandeClient(idCmd);
    }
    return of();
  }

  findAllLigneCommandeFournisseur(idCmd?: number): Observable<LigneCommandeFournisseurDto[]>{
    if(idCmd){
      return this.commandeFournisseurService.findAllLigneCommadeByCommandeFournisseur(idCmd);
    }
    return of();
  }

  findAllByIdClient(clientDTO: ClientDto): Observable<CommandeClientDto[]> {
    if (clientDTO) {
      return this.commandeClientService.findAllByClientPOST(clientDTO);
    }
    return of();
  }

  findAllByIdFournisseur(fournisseurDto: FournisseurDto): Observable<CommandeFournisseurDto[]> {
    if (fournisseurDto) {
      return this.commandeFournisseurService.findAllByFournisseurPOST(fournisseurDto);
    }
    return of();
  }

}
