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
    commandeClientDTO.identreprise=this.userServise.getConnectedUser().entreprise?.id;
    return this.commandeClientService.CommandeClientApiSavePOST(commandeClientDTO, date);
    
  }

  enregistrerCommandeFournisseur(commandeFournisseurDTO: CommandeFournisseurDto, date: number):Observable<CommandeFournisseurDto> {
    commandeFournisseurDTO.identreprise=this.userServise.getConnectedUser().entreprise?.id;
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

  updateEtatCommandeClient(idCommande: number, etat: string): Observable<CommandeClientDto> {
    return this.commandeClientService.CommandeClientApiUpdateEtatCommandePATCH({
      idCommande: idCommande,
      etatCommande: etat as any
    });
  }

  updateEtatCommandeFournisseur(idCommande: number, etat: string): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.CommandeFournisseurApiUpdateEtatCommandePATCH(
      String(idCommande),
      etat
    );
  }

  findCommandeClientById(id: number): Observable<CommandeClientDto> {
    return this.commandeClientService.CommandeClientApiFindByIdGET(id);
  }

  findCommandeFournisseurById(id: number): Observable<CommandeFournisseurDto> {
    return this.commandeFournisseurService.CommandeFournisseurApiFindByIdGET(id);
  }

updateCommandeClient(commandeClientDTO: CommandeClientDto, date: number): Observable<CommandeClientDto> {
      console.log('Données commandeClientDTO:', JSON.stringify(commandeClientDTO, null, 2));
      commandeClientDTO.identreprise = this.userServise.getConnectedUser().entreprise?.id;
      console.log('identreprise:', commandeClientDTO.identreprise);
      return this.commandeClientService.CommandeClientApiSavePOST(commandeClientDTO, date);
    }

   updateCommandeFournisseur(commandeFournisseurDTO: CommandeFournisseurDto, date: number): Observable<CommandeFournisseurDto> {
     commandeFournisseurDTO.identreprise = this.userServise.getConnectedUser().entreprise?.id;
     return this.commandeFournisseurService.save(commandeFournisseurDTO, date);
   }

supprimerCommandeClient(id: number): Observable<null> {
      return this.commandeClientService.CommandeClientApiDeleteDELETE(String(id));
    }

    supprimerCommandeFournisseur(id: number): Observable<null> {
      return this.commandeFournisseurService.CommandeFournisseurApiDELETE(id);
    }

    updateQuantiteCommandeClient(idCommande: number, idLigneCommande: number, quantite: number): Observable<CommandeClientDto> {
      return this.commandeClientService.CommandeClientApiUpdateQuantiterCommandePATCH({
        idCommande: idCommande,
        idLigneCommande: idLigneCommande,
        quantite: quantite
      });
    }

    updateQuantiteCommandeFournisseur(idCommande: number, idLigneCommande: number, quantite: number): Observable<CommandeFournisseurDto> {
      return this.commandeFournisseurService.CommandeFournisseurApiUpdateQuantiterCommandePATCH(
        String(idCommande),
        String(idLigneCommande),
        String(quantite)
      );
    }

    updateArticleCommandeClient(idCommande: number, idLigneCommande: number, newIdArticle: number): Observable<CommandeClientDto> {
      return this.commandeClientService.CommandeClientApiUpdateArticlePATCH({
        idCommande: idCommande,
        idLigneCommande: idLigneCommande,
        newIdArticle: newIdArticle
      });
    }

    updateArticleCommandeFournisseur(idCommande: number, idLigneCommande: number, newIdArticle: number): Observable<CommandeFournisseurDto> {
      return this.commandeFournisseurService.CommandeFournisseurApiUpdateArticlePATCH({
        idCommande: idCommande,
        idLigneCommande: idLigneCommande,
        newIdArticle: newIdArticle
      });
    }

    deleteLigneCommandeClient(idCommande: number, idLigneCommande: number): Observable<CommandeClientDto> {
      return this.commandeClientService.CommandeClientApiDeleteArticleDELETE(String(idCommande), String(idLigneCommande));
    }

    deleteLigneCommandeFournisseur(idCommande: number, idLigneCommande: number): Observable<CommandeFournisseurDto> {
      return this.commandeFournisseurService.CommandeFournisseurApiDeleteArticleDELETE(String(idCommande), String(idLigneCommande));
    }

}
