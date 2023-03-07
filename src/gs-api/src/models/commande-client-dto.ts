/* tslint:disable */
import { ClientDto } from './client-dto';
export interface CommandeClientDto {
  client?: ClientDto;
  code?: string;
  commandeLivree?: boolean;
  dateCommande?: number;
  etatcommande?: 'EN_PREPARATIOM' | 'VALIDEE' | 'LIVREE';
  id?: number;
  identreprise?: number;
}
