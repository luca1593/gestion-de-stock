export interface Menu{
    id?: string;
    titre?: string;
    icon?: string;
    url?: string;
    sousMenus?: Array<Menu>;
}