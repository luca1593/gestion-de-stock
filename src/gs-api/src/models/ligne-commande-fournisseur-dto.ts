/* tslint:disable */
import { ArticleDto } from './article-dto';
import { CommandeFournisseurDto } from './commande-fournisseur-dto';
export interface LigneCommandeFournisseurDto {
  article?: ArticleDto;
  commandefournisseur?: CommandeFournisseurDto;
  id?: number;
  prixUnitaire?: number;
  quantite?: number;
  identreprise?: number;
}
