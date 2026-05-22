/* tslint:disable */
import { CategoryDto } from './category-dto';
import { EntrepriseDto } from './entreprise-dto';
import { LigneVenteDto } from './ligne-vente-dto';
import { LigneCommandeClientDto } from './ligne-commande-client-dto';
import { LigneCommandeFournisseurDto } from './ligne-commande-fournisseur-dto';
import { MvtStkDto } from './mvt-stk-dto';

export interface ArticleDto {
  id?: number;
  codeArticle?: string;
  designation?: string;
  prixUnitaireht?: number;
  tauxTva?: number;
  prixTtc?: number;
  stock?: number;
  photo?: string;
  category?: CategoryDto;
  creationDate?: string;
  lastModifiedDate?: string;
  entreprise?: EntrepriseDto;
  ligneVentes?: Array<LigneVenteDto>;
  ligneCommandeClients?: Array<LigneCommandeClientDto>;
  ligneCommandeFournisseurs?: Array<LigneCommandeFournisseurDto>;
  mvtStks?: Array<MvtStkDto>;
}
