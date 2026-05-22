/* tslint:disable */
import { FournisseurDto } from './fournisseur-dto';
import { LigneCommandeFournisseurDto } from './ligne-commande-fournisseur-dto';

export interface CommandeFournisseurDto {
  id?: number;
  code?: string;
  dateCommande?: string;
  etatcommande?: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  fournisseur?: FournisseurDto;
  ligneCommandeFournisseurs?: Array<LigneCommandeFournisseurDto>;
  identreprise?: number;
}
