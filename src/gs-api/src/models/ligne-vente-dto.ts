/* tslint:disable */
import { ArticleDto } from './article-dto';
import { VenteDto } from './vente-dto';

export interface LigneVenteDto {
  id?: number;
  vente?: VenteDto;
  article?: ArticleDto;
  quantite?: number;
  prixUnitaire?: number;
  identreprise?: number;
}
