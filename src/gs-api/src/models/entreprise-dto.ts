/* tslint:disable */
import { AdresseDto } from './adresse-dto';
import { UtilisateurDto } from './utilisateur-dto';
export interface EntrepriseDto {
  adresse?: AdresseDto;
  codeFiscal?: string;
  description?: string;
  email?: string;
  id?: number;
  nom?: string;
  numTel?: string;
  photo?: string;
  siteWeb?: string;
  utilisateurs?: Array<UtilisateurDto>;
}
