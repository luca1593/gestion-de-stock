/* tslint:disable */
import { AdresseDto } from './adresse-dto';
import { CommandeClientDto } from './commande-client-dto';
export interface ClientDto {
  adresse?: AdresseDto;
  commandeClients?: Array<CommandeClientDto>;
  email?: string;
  id?: number;
  nom?: string;
  numTel?: string;
  photo?: string;
  prenom?: string;
  identreprise?: number;
}
