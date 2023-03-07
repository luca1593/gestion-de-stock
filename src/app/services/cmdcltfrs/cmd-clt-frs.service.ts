import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandeClientDto, CommandeFournisseurDto } from 'src/gs-api/src/models';
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

  enregistrerCommandeClient(commandeClientDTO: CommandeClientDto): Observable<CommandeClientDto> {
    commandeClientDTO.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.commandeClientService.CommandeClientApiSavePOST(commandeClientDTO);
    
  }

  enregistrerCommandeFournisseur(commandeFournisseurDTO: CommandeFournisseurDto):Observable<CommandeFournisseurDto> {
    commandeFournisseurDTO.identreprise = this.userServise.getConnectedUser().entreprise?.id;
    return this.commandeFournisseurService.save(commandeFournisseurDTO);
  }

}
