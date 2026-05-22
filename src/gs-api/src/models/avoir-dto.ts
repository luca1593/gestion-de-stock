import { ClientDto } from './client-dto';
import { VenteDto } from './vente-dto';

export interface AvoirDto {
  id?: number;
  code?: string;
  dateAvoir?: string;
  montant?: number;
  raison?: string;
  etat?: 'BROUILLON' | 'VALIDE' | 'ANNULE';
  client?: ClientDto;
  vente?: VenteDto;
  identreprise?: number;
}
