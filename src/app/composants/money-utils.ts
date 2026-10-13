/**
 * Utilitaires monetaires partages.
 *
 * Un montant manipule en JavaScript est un flottant : 99.99 * 1.055 vaut
 * 105.48944999999999. Sans arrondi, le prix TTC affiche cette valeur brute et
 * la base enregistre 105.48944999999999. Tous les calculs de prix, de
 * sous-total et de total passent donc par ici.
 */

/** Arrondit un montant à deux decimales, sans erreur de representation. */
export function arrondiMonetaire(valeur: number | null | undefined): number {
  if (valeur == null || isNaN(valeur as number)) {
    return 0;
  }
  // * 100 puis arrondi : evite Math.round(x * 100) / 100 qui accumule
  // l'imprecision du flottant sur les grands montants.
  return Math.round((valeur as number) * 100 + Number.EPSILON * Math.sign(valeur as number)) / 100;
}

/** Sous-total d'une ligne de vente ou de commande. */
export function sousTotalLigne(prixUnitaire: number | null | undefined, quantite: number | null | undefined): number {
  if (prixUnitaire == null || quantite == null) {
    return 0;
  }
  return arrondiMonetaire(prixUnitaire * quantite);
}

/** Somme des sous-totaux d'un ensemble de lignes. */
export function totalLignes(lignes: Array<{ prixUnitaire?: number | null, quantite?: number | null }>): number {
  const somme = (lignes || []).reduce((acc, l) => acc + sousTotalLigne(l.prixUnitaire, l.quantite), 0);
  return arrondiMonetaire(somme);
}