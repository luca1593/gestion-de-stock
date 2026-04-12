export interface AlertStockDto {
  id?: number;
  articleId?: number;
  designation?: string;
  stockActuel?: number;
  seuilMinimum?: number;
  seuilCritique?: number;
  niveauAlerte?: 'CRITIQUE' | 'BAS' | 'MOYEN';
  active?: boolean;
  identreprise?: number;
}