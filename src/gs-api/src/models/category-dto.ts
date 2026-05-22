/* tslint:disable */
import { ArticleDto } from './article-dto';

export interface CategoryDto {
  id?: number;
  code?: string;
  designation?: string;
  identreprise?: number;
  articles?: Array<ArticleDto>;
}
