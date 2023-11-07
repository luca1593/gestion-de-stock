/* tslint:disable */
import { ClientDto } from './client-dto';
import { LigneCommandeClientDto } from './ligne-commande-client-dto';
export interface CommandeClientDto {
  client?: ClientDto;
  code?: string;
  commandeLivree?: boolean;
  dateCommande?: number;
  etatcommande?: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  id?: number;
  identreprise?: number;
  ligneCommandeClients?: Array<LigneCommandeClientDto>;
}
