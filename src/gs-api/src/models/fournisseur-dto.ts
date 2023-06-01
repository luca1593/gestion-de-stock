/* tslint:disable */
import { AdresseDto } from './adresse-dto';
import { CommandeFournisseurDto } from './commande-fournisseur-dto';
export interface FournisseurDto {
  adresse?: AdresseDto;
  commandeFournisseurs?: Array<CommandeFournisseurDto>;
  email?: string;
  id?: number;
  nom?: string;
  numTel?: string;
  photo?: string;
  prenom?: string;
  identreprise?: number;
}
