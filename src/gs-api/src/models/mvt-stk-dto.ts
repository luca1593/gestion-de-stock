/* tslint:disable */
import { ArticleDto } from './article-dto';

export interface MvtStkDto {
  id?: number;
  dateMvt?: string;
  quantite?: number;
  article?: ArticleDto;
  typeMvt?: 'ENTRER' | 'SORTIR';
  sourceMvt?: 'COMMANDE_FOURNISSEUR' | 'COMMANDE_CLIENT' | 'INVENTAIRE' | 'TRANSFERT' | 'MANUEL';
  identreprise?: number;
}
