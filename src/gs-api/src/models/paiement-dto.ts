/* tslint:disable */

export interface PaiementDto {
  id?: number;
  montant?: number;
  datePaiement?: string;
  modePaiement?: 'ESPECES' | 'VIREMENT' | 'CHEQUE' | 'CARTE' | 'MOBILE_MONEY';
  reference?: string;
  note?: string;
  factureId?: number;
  factureNumero?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}
