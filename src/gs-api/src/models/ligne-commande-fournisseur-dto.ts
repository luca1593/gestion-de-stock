/* tslint:disable */
import { ArticleDto } from './article-dto';
import { CommandeFournisseurDto } from './commande-fournisseur-dto';

export interface LigneCommandeFournisseurDto {
  id?: number;
  article?: ArticleDto;
  commandefournisseur?: CommandeFournisseurDto;
  quantite?: number;
  prixUnitaire?: number;
  identreprise?: number;
}
