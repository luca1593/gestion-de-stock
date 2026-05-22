/* tslint:disable */
import { ClientDto } from './client-dto';
import { LigneCommandeClientDto } from './ligne-commande-client-dto';

export interface CommandeClientDto {
  id?: number;
  code?: string;
  dateCommande?: string;
  etatcommande?: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  client?: ClientDto;
  ligneCommandeClients?: Array<LigneCommandeClientDto>;
  identreprise?: number;
}
