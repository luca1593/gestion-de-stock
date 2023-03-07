/* tslint:disable */
import { CategoryDto } from './category-dto';
import { EntrepriseDto } from './entreprise-dto';
export interface ArticleDto {
  category?: CategoryDto;
  codeArticle?: string;
  designation?: string;
  id?: number;
  photo?: string;
  prixTtc?: number;
  prixUnitaireht?: number;
  tauxTva?: number;
  entreprise?: EntrepriseDto;
}
