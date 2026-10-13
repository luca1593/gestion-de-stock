/**
 * Utilitaires de listes paginees.
 */

/**
 * Recale la page courante sur une page qui existe encore.
 *
 * Apres une suppression, le nombre de pages diminue mais la page courante
 * reste la meme. ngx-pagination calcule alors sa tranche a partir de
 * l'ancienne page : sur la page 3 devenue inexistante il affiche
 * « Affichage de 16 à 15 sur 15 avoirs » au-dessus d'un tableau vide.
 * L'utilisateur se retrouve sur une page fantôme, sans aucun moyen de
 * revenir en arrière autrement qu'en changeant de filtre.
 *
 * @param pageCourante page affichee, 1 par convention
 * @param totalItems nombre d'elements restant dans la liste filtree
 * @param taillePage nombre d'elements par page
 * @returns une page comprise entre 1 et le nombre de pages restant
 */
export function pageValide(pageCourante: number, totalItems: number, taillePage: number): number {
  const page = Number(pageCourante);
  const total = Number(totalItems);
  const taille = Math.max(1, Number(taillePage) || 1);

  if (!isFinite(page) || page < 1) {
    return 1;
  }

  const nbPages = Math.max(1, Math.ceil((isFinite(total) ? total : 0) / taille));
  return Math.min(page, nbPages);
}