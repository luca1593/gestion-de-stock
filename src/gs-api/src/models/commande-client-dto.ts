/* tslint:disable */
import { ClientDto } from './client-dto';
import { LigneCommandeClientDto } from './ligne-commande-client-dto';
export interface CommandeClientDto {
  id?: number;
  client?: ClientDto;
  code?: string;
  commandeLivree?: boolean;
  etatcommande?: 'EN_PREPARATIOM' | 'VALIDEE' | 'LIVREE';
  dateCommande?: number;
  ligneCommandeClients?: Array<LigneCommandeClientDto>;
  identreprise?: number;
}
