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

/**
 * Date affichable, ou « — » quand elle est absente ou aberrante.
 *
 * Plusieurs enregistrements anciens ont ete crees sans date : le backend
 * renvoie alors l'epoque Unix (1970-01-21T14:16:31Z) au lieu de null. Le
 * pipe `date` afficheait donc « 21/01/1970 » en tete de liste, ce qui donne
 * l'impression d'une application cassee et remonte ces lignes en premiere
 * position des qu'on trie par date.
 *
 * Aucune donnee metier ne peut preceder la creation de l'entreprise : une
 * annee anterieure a 1990 est traitee comme une date manquante.
 *
 * @param valeur date brute du DTO (chaene ISO, Date, ou valeur nulle)
 * @returns la date formatee « jj/mm/aaaa », ou « — »
 */
export function dateLisible(valeur: string | Date | null | undefined): string {
  if (valeur === null || valeur === undefined || valeur === '') {
    return '—';
  }

  const date = valeur instanceof Date ? valeur : new Date(valeur);
  if (isNaN(date.getTime()) || date.getFullYear() < 1990) {
    return '—';
  }

  const jj = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${jj}/${mm}/${date.getFullYear()}`;
}