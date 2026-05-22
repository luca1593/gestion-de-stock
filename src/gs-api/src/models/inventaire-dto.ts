/* tslint:disable */
import { InventaireLigneDto } from './inventaire-ligne-dto';

export interface InventaireDto {
  id?: number;
  code?: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  statut?: 'EN_COURS' | 'TERMINE' | 'ANNULE';
  entrepotId?: number;
  entrepotNom?: string;
  lignes?: Array<InventaireLigneDto>;
  entrepriseId?: number;
  entrepriseNom?: string;
}
