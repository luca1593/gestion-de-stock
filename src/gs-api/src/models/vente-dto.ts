/* tslint:disable */
import { LigneVenteDto } from './ligne-vente-dto';

export interface VenteDto {
  id?: number;
  code?: string;
  dateVente?: string;
  commentaire?: string;
  ligneVentes?: Array<LigneVenteDto>;
  identreprise?: number;
}
