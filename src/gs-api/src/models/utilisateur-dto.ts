/* tslint:disable */
import { AdresseDto } from './adresse-dto';
import { EntrepriseDto } from './entreprise-dto';
import { RoleDto } from './role-dto';

export interface UtilisateurDto {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  dateDeNaissance?: string;
  dateDeNasissance?: number | string;
  dateDeNasissanceTemp?: string;
  motDePasse?: string;
  adresse?: AdresseDto;
  photo?: string;
  entreprise?: EntrepriseDto;
  roles?: Array<RoleDto>;
}
