/* tslint:disable */
import { LigneVenteDto } from './ligne-vente-dto';
export interface VenteDto {
  code?: string;
  commentaire?: string;
  dateVente?: number;
  id?: number;
  ligneVentes?: Array<LigneVenteDto>;
  identreprise?: number;
}
