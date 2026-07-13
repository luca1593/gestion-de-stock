import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, map, catchError } from 'rxjs';
import { ArticleDto, ClientDto, FournisseurDto, CategoryDto, UtilisateurDto, VenteDto, CommandeClientDto, CommandeFournisseurDto } from 'src/gs-api/src/models';
import { ArtcleService } from '../article/artcle.service';
import { CltfrsService } from '../cltfrs/cltfrs.service';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { VenteService } from '../vente/vente.service';
import { CmdCltFrsService } from '../cmdcltfrs/cmd-clt-frs.service';

export interface SearchResult {
  type: 'article' | 'client' | 'fournisseur' | 'categorie' | 'utilisateur' | 'vente' | 'commande';
  label: string;
  description: string;
  id: number;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private articleService: ArtcleService,
    private cltfrsService: CltfrsService,
    private categoryService: CategoryService,
    private userService: UserService,
    private venteService: VenteService,
    private cmdCltFrsService: CmdCltFrsService
  ) {}

  search(query: string, context: string): Observable<SearchResult[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const queryLower = query.toLowerCase();

    switch (context) {
      case 'articles':
        return this.searchArticles(queryLower);
      case 'clients':
        return this.searchClients(queryLower);
      case 'fournisseurs':
        return this.searchFournisseurs(queryLower);
      case 'categories':
        return this.searchCategories(queryLower);
      case 'utilisateurs':
        return this.searchUtilisateurs(queryLower);
      case 'vente':
      case 'liste-vente':
        return this.searchVentes(queryLower);
      case 'commande-client':
        return this.searchCommandesClient(queryLower);
      case 'commande-fournisseur':
        return this.searchCommandesFournisseur(queryLower);
      default:
        return this.searchAll(queryLower);
    }
  }

  private searchArticles(query: string): Observable<SearchResult[]> {
    return this.articleService.findAllArticle().pipe(
      map(articles => articles
        .filter(a =>
          a.codeArticle?.toLowerCase().includes(query) ||
          a.designation?.toLowerCase().includes(query)
        )
        .slice(0, 10)
        .map(a => ({
          type: 'article' as const,
          label: a.codeArticle || '',
          description: a.designation || '',
          id: a.id || 0,
          url: `detail-article/${a.id}`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchClients(query: string): Observable<SearchResult[]> {
    return this.cltfrsService.findAllClient().pipe(
      map(clients => clients
        .filter(c =>
          c.nom?.toLowerCase().includes(query) ||
          c.prenom?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query)
        )
        .slice(0, 10)
        .map(c => ({
          type: 'client' as const,
          label: `${c.nom} ${c.prenom}`,
          description: c.email || '',
          id: c.id || 0,
          url: `detail-client/${c.id}`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchFournisseurs(query: string): Observable<SearchResult[]> {
    return this.cltfrsService.findAllFournisseurs().pipe(
      map(fournisseurs => fournisseurs
        .filter(f =>
          f.nom?.toLowerCase().includes(query) ||
          f.prenom?.toLowerCase().includes(query) ||
          f.email?.toLowerCase().includes(query)
        )
        .slice(0, 10)
        .map(f => ({
          type: 'fournisseur' as const,
          label: `${f.nom} ${f.prenom}`,
          description: f.email || '',
          id: f.id || 0,
          url: `detail-fournisseur/${f.id}`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchCategories(query: string): Observable<SearchResult[]> {
    return this.categoryService.findAll().pipe(
      map(categories => categories
        .filter(c => c.code?.toLowerCase().includes(query) || c.designation?.toLowerCase().includes(query))
        .slice(0, 10)
        .map(c => ({
          type: 'categorie' as const,
          label: c.code || '',
          description: c.designation || '',
          id: c.id || 0,
          url: `nouvel-categorie/${c.id}`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchUtilisateurs(query: string): Observable<SearchResult[]> {
    return this.userService.findAll().pipe(
      map(users => users
        .filter(u =>
          u.nom?.toLowerCase().includes(query) ||
          u.prenom?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
        )
        .slice(0, 10)
        .map(u => ({
          type: 'utilisateur' as const,
          label: `${u.nom} ${u.prenom}`,
          description: u.email || '',
          id: u.id || 0,
          url: `utilisateurs`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchVentes(query: string): Observable<SearchResult[]> {
    return this.venteService.findAllVente().pipe(
      map(ventes => ventes
        .filter(v => v.code?.toLowerCase().includes(query))
        .slice(0, 10)
        .map(v => ({
          type: 'vente' as const,
          label: v.code || '',
          description: v.dateVente ? new Date(v.dateVente).toLocaleDateString('fr-FR') : '',
          id: v.id || 0,
          url: `liste-vente`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchCommandesClient(query: string): Observable<SearchResult[]> {
    return this.cmdCltFrsService.findAllCommandeClient().pipe(
      map(commandes => commandes
        .filter(c => c.code?.toLowerCase().includes(query))
        .slice(0, 10)
        .map(c => ({
          type: 'commande' as const,
          label: c.code || '',
          description: c.etatcommande || '',
          id: c.id || 0,
          url: `nouvel-commande-client/${c.id}`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchCommandesFournisseur(query: string): Observable<SearchResult[]> {
    return this.cmdCltFrsService.findAllCommandeFournisseur().pipe(
      map(commandes => commandes
        .filter(c => c.code?.toLowerCase().includes(query))
        .slice(0, 10)
        .map(c => ({
          type: 'commande' as const,
          label: c.code || '',
          description: c.etatcommande || '',
          id: c.id || 0,
          url: `nouvel-commande-fournisseur/${c.id}`
        }))
      ),
      catchError(() => of([]))
    );
  }

  private searchAll(query: string): Observable<SearchResult[]> {
    return forkJoin([
      this.articleService.findAllArticle().pipe(
        map(articles => {
          const items: SearchResult[] = [];
          articles.slice(0, 5).forEach(a => {
            if (a.codeArticle?.toLowerCase().includes(query) || a.designation?.toLowerCase().includes(query)) {
              items.push({ type: 'article', label: a.codeArticle || '', description: a.designation || '', id: a.id || 0, url: `detail-article/${a.id}` });
            }
          });
          return items;
        }),
        catchError(() => of([] as SearchResult[]))
      ),
      this.cltfrsService.findAllClient().pipe(
        map(clients => {
          const items: SearchResult[] = [];
          clients.slice(0, 5).forEach(c => {
            if (c.nom?.toLowerCase().includes(query) || c.prenom?.toLowerCase().includes(query)) {
              items.push({ type: 'client', label: `${c.nom} ${c.prenom}`, description: c.email || '', id: c.id || 0, url: `detail-client/${c.id}` });
            }
          });
          return items;
        }),
        catchError(() => of([] as SearchResult[]))
      ),
      this.cltfrsService.findAllFournisseurs().pipe(
        map(fournisseurs => {
          const items: SearchResult[] = [];
          fournisseurs.slice(0, 5).forEach(f => {
            if (f.nom?.toLowerCase().includes(query) || f.prenom?.toLowerCase().includes(query)) {
              items.push({ type: 'fournisseur', label: `${f.nom} ${f.prenom}`, description: f.email || '', id: f.id || 0, url: `detail-fournisseur/${f.id}` });
            }
          });
          return items;
        }),
        catchError(() => of([] as SearchResult[]))
      ),
      this.categoryService.findAll().pipe(
        map(categories => {
          const items: SearchResult[] = [];
          categories.slice(0, 5).forEach(c => {
            if (c.code?.toLowerCase().includes(query) || c.designation?.toLowerCase().includes(query)) {
              items.push({ type: 'categorie', label: c.code || '', description: c.designation || '', id: c.id || 0, url: `nouvel-categorie/${c.id}` });
            }
          });
          return items;
        }),
        catchError(() => of([] as SearchResult[]))
      ),
      this.userService.findAll().pipe(
        map(users => {
          const items: SearchResult[] = [];
          users.slice(0, 5).forEach(u => {
            if (u.nom?.toLowerCase().includes(query) || u.prenom?.toLowerCase().includes(query)) {
              items.push({ type: 'utilisateur', label: `${u.nom} ${u.prenom}`, description: u.email || '', id: u.id || 0, url: `utilisateurs` });
            }
          });
          return items;
        }),
        catchError(() => of([] as SearchResult[]))
      ),
      this.venteService.findAllVente().pipe(
        map(ventes => {
          const items: SearchResult[] = [];
          ventes.slice(0, 5).forEach(v => {
            if (v.code?.toLowerCase().includes(query)) {
              items.push({ type: 'vente', label: v.code || '', description: v.dateVente ? new Date(v.dateVente).toLocaleDateString('fr-FR') : '', id: v.id || 0, url: `liste-vente` });
            }
          });
          return items;
        }),
        catchError(() => of([] as SearchResult[]))
      )
    ]).pipe(
      map((arrays: SearchResult[][]) => {
        const all: SearchResult[] = [];
        arrays.forEach(arr => all.push(...arr));
        return all.slice(0, 20);
      })
    );
  }
}
