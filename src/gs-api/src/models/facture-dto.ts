/* tslint:disable */

export interface FactureDto {
  id?: number;
  numeroFacture?: string;
  dateFacture?: string;
  dateEcheance?: string;
  statut?: 'EN_ATTENTE' | 'PARTIELLEMENT_PAYEE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';
  montantHT?: number;
  montantTVA?: number;
  montantTTC?: number;
  montantPaye?: number;
  montantRestant?: number;
  clientId?: number;
  clientNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}
