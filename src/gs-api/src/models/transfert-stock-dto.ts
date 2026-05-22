/* tslint:disable */

export interface TransfertStockDto {
  id?: number;
  code?: string;
  dateTransfert?: string;
  statut?: 'EN_ATTENTE' | 'EN_TRANSIT' | 'RECU' | 'ANNULE';
  entrepotSourceId?: number;
  entrepotSourceNom?: string;
  entrepotDestinationId?: number;
  entrepotDestinationNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}
