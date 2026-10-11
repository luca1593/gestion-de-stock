export interface Menu{
    id?: string;
    titre?: string;
    icon?: string;
    url?: string;
    active?: boolean;
    sousMenus?: Array<Menu>;
    // Autres segments d'URL rattachés à cette entrée (pages détail, création,
    // édition) : les routes sont plates, donc la correspondance ne peut pas se
    // déduire de la hiérarchie. Sans toucher aux URLs.
    matchUrls?: string[];
}