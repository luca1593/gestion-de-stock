/* tslint:disable */
import { ArticleDto } from './article-dto';
import { CommandeClientDto } from './commande-client-dto';

export interface LigneCommandeClientDto {
  id?: number;
  article?: ArticleDto;
  commandeClient?: CommandeClientDto;
  quantite?: number;
  prixUnitaire?: number;
  identreprise?: number;
}
