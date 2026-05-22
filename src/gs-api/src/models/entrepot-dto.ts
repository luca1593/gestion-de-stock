/* tslint:disable */
import { AdresseDto } from './adresse-dto';

export interface EntrepotDto {
  id?: number;
  code?: string;
  nom?: string;
  description?: string;
  adresse?: AdresseDto;
  estPrincipal?: boolean;
  entrepriseId?: number;
  entrepriseNom?: string;
}
