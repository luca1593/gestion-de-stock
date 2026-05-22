/* tslint:disable */

export interface RegleTarifaireDto {
  id?: number;
  code?: string;
  nom?: string;
  description?: string;
  typeRegle?: 'REMISE_POURCENTAGE' | 'REMISE_MONTANT_FIXE' | 'PRIX_SPECIFIQUE' | 'PROMOTION';
  valeur?: number;
  estActif?: boolean;
  dateDebut?: string;
  dateFin?: string;
  quantiteMinimale?: number;
  montantMinimal?: number;
  categorieId?: number;
  categorieDesignation?: string;
  clientId?: number;
  clientNom?: string;
  entrepriseId?: number;
  entrepriseNom?: string;
}
