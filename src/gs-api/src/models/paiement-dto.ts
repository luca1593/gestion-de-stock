/* tslint:disable */

export interface PaiementDto {
  id?: number;
  montant?: number;
  montantDonne?: number;
  monnaie?: number;
  datePaiement?: string;
  modePaiement?: 'ESPECES' | 'CHEQUE' | 'VIREMENT_BANCAIRE' | 'CARTE_BANCAIRE' | 'MOBILE_MONEY' | 'AUTRE';
  reference?: string;
  note?: string;
  factureId?: number;
  factureNumero?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}