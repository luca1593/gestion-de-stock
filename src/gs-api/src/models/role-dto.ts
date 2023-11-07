/* tslint:disable */
import { UtilisateurDto } from './utilisateur-dto';
export interface RoleDto {
  id?: number;
  roleNom?: string;
  utilisateur?: UtilisateurDto;
}
