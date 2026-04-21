/* tslint:disable */
import { AdresseDto } from './adresse-dto';
import { EntrepriseDto } from './entreprise-dto';
import { RoleDto } from './role-dto';
export interface UtilisateurDto {
  adresse?: AdresseDto;
  dateDeNasissance?: number | string;
  dateDeNasissanceTemp?: string;
  email?: string;
  entreprise?: EntrepriseDto;
  id?: number;
  motDePasse?: string;
  nom?: string;
  pays?: string;
  photo?: string;
  prenom?: string;
  roles?: Array<RoleDto>;
}
