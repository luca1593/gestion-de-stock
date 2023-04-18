/* tslint:disable */
import { FournisseurDto } from './fournisseur-dto';
import { LigneCommandeFournisseurDto } from './ligne-commande-fournisseur-dto';

export interface CommandeFournisseurDto {
  id?: number;
  fournisseur?: FournisseurDto;
  code?: string;
  commandeLivree?: boolean;
  etatcommande?: 'EN_PREPARATIOM' | 'VALIDEE' | 'LIVREE';
  dateCommande?: number;
  ligneCommandeFournisseurs?: Array<LigneCommandeFournisseurDto>;
  identreprise?: number;
}
