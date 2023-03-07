/* tslint:disable */
import { FournisseurDto } from './fournisseur-dto';
export interface CommandeFournisseurDto {
  code?: string;
  commandeLivree?: boolean;
  dateCommande?: number;
  etatcommande?: 'EN_PREPARATIOM' | 'VALIDEE' | 'LIVREE';
  fournisseur?: FournisseurDto;
  id?: number;
  identreprise?: number;
}
