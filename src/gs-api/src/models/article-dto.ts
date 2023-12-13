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
  prixFrs?:number;
  prixUnitaireht?: number;
  tauxTva?: number;
  stock?: number;
  entreprise?: EntrepriseDto;
  creationDate?: number;
  lastModifiedDate?: number;
}
