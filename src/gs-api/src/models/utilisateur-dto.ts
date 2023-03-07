/* tslint:disable */
import { AdresseDto } from './adresse-dto';
import { EntrepriseDto } from './entreprise-dto';
import { RoleDto } from './role-dto';
export interface UtilisateurDto {
  adresse?: AdresseDto;
  dateDeNaissance?: number;
  email?: string;
  entreprise?: EntrepriseDto;
  id?: number;
  motDePasse?: string;
  nom?: string;
  photo?: string;
  prenom?: string;
  roles?: Array<RoleDto>;
}
