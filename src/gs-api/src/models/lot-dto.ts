/* tslint:disable */

export interface LotDto {
  id?: number;
  numeroLot?: string;
  quantite?: number;
  quantiteRestante?: number;
  dateFabrication?: string;
  dateExpiration?: string;
  prixAchat?: number;
  articleId?: number;
  articleDesignation?: string;
  entrepotId?: number;
  entrepotNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
  estCompletementUtilise?: boolean;
}
