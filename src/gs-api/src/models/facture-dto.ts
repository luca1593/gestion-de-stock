/* tslint:disable */
import { PaiementDto } from './paiement-dto';

export interface FactureDto {
  id?: number;
  numeroFacture?: string;
  dateFacture?: string;
  dateEcheance?: string;
  statut?: 'EN_ATTENTE' | 'PARTIELLEMENT_PAYEE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';
  typeFacture?: 'CLIENT' | 'FOURNISSEUR';
  sourceType?: 'VENTE' | 'COMMANDE_CLIENT' | 'COMMANDE_FOURNISSEUR';
  sourceId?: number;
  montantHT?: number;
  montantTVA?: number;
  montantTTC?: number;
  montantPaye?: number;
  montantRestant?: number;
  clientId?: number;
  clientNom?: string;
  fournisseurId?: number;
  fournisseurNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
  paiement?: PaiementDto;
}