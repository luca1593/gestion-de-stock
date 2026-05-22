export interface AlertStockDto {
  id?: number;
  articleId?: number;
  designation?: string;
  stockActuel?: number;
  seuilMinimum?: number;
  seuilCritique?: number;
  niveauAlerte?: 'FAIBLE' | 'MOYEN' | 'CRITIQUE';
  active?: boolean;
  identreprise?: number;
}
