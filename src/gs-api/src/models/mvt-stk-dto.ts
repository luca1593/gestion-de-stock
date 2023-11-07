/* tslint:disable */
import { ArticleDto } from './article-dto';
export interface MvtStkDto {
  article?: ArticleDto;
  dateMvt?: number;
  id?: number;
  identreprise?: number;
  quantite?: number;
  sourceMvt?: 'COMMANDE_CLIENT' | 'COMMANDE_FOURNISSEUR' | 'VENTE';
  typeMvt?: 'ENTRER' | 'SORTIE' | 'CORRECTION_POS' | 'CORRECTION_NEG';
}
