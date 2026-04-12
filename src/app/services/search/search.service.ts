import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

    const results: SearchResult[] = [];
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
    return new Observable(observer => {
      this.articleService.findAllArticle().subscribe(articles => {
        const results = articles
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
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchClients(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.cltfrsService.findAllClient().subscribe(clients => {
        const results = clients
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
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchFournisseurs(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.cltfrsService.findAllFournisseurs().subscribe(fournisseurs => {
        const results = fournisseurs
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
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchCategories(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.categoryService.findAll().subscribe(categories => {
        const results = categories
          .filter(c => c.code?.toLowerCase().includes(query) || c.designation?.toLowerCase().includes(query))
          .slice(0, 10)
          .map(c => ({
            type: 'categorie' as const,
            label: c.code || '',
            description: c.designation || '',
            id: c.id || 0,
            url: `nouvel-categorie/${c.id}`
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchUtilisateurs(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.userService.findAll().subscribe(users => {
        const results = users
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
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchVentes(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.venteService.findAllVente().subscribe(ventes => {
        const results = ventes
          .filter(v => v.code?.toLowerCase().includes(query))
          .slice(0, 10)
          .map(v => ({
            type: 'vente' as const,
            label: v.code || '',
            description: v.dateVente ? new Date(v.dateVente).toLocaleDateString('fr-FR') : '',
            id: v.id || 0,
            url: `liste-vente`
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchCommandesClient(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.cmdCltFrsService.findAllCommandeClient().subscribe(commandes => {
        const results = commandes
          .filter(c => c.code?.toLowerCase().includes(query))
          .slice(0, 10)
          .map(c => ({
            type: 'commande' as const,
            label: c.code || '',
            description: c.etatcommande || '',
            id: c.id || 0,
            url: `nouvel-commande-client/${c.id}`
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchCommandesFournisseur(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      this.cmdCltFrsService.findAllCommandeFournisseur().subscribe(commandes => {
        const results = commandes
          .filter(c => c.code?.toLowerCase().includes(query))
          .slice(0, 10)
          .map(c => ({
            type: 'commande' as const,
            label: c.code || '',
            description: c.etatcommande || '',
            id: c.id || 0,
            url: `nouvel-commande-fournisseur/${c.id}`
          }));
        observer.next(results);
        observer.complete();
      });
    });
  }

  private searchAll(query: string): Observable<SearchResult[]> {
    return new Observable(observer => {
      const allResults: SearchResult[] = [];
      let completed = 0;
      let total = 6;

      this.articleService.findAllArticle().subscribe({
        next: (articles) => {
          articles.slice(0, 5).forEach(a => {
            if (a.codeArticle?.toLowerCase().includes(query) || a.designation?.toLowerCase().includes(query)) {
              allResults.push({
                type: 'article',
                label: a.codeArticle || '',
                description: a.designation || '',
                id: a.id || 0,
                url: `detail-article/${a.id}`
              });
            }
          });
          completed++;
          if (completed === total) observer.next(allResults.slice(0, 20));
        },
        complete: () => { completed++; if (completed === total) observer.next(allResults.slice(0, 20)); }
      });

      this.cltfrsService.findAllClient().subscribe({
        next: (clients) => {
          clients.slice(0, 5).forEach(c => {
            if (c.nom?.toLowerCase().includes(query) || c.prenom?.toLowerCase().includes(query)) {
              allResults.push({
                type: 'client',
                label: `${c.nom} ${c.prenom}`,
                description: c.email || '',
                id: c.id || 0,
                url: `detail-client/${c.id}`
              });
            }
          });
          completed++;
          if (completed === total) observer.next(allResults.slice(0, 20));
        },
        complete: () => { completed++; if (completed === total) observer.next(allResults.slice(0, 20)); }
      });

      this.cltfrsService.findAllFournisseurs().subscribe({
        next: (fournisseurs) => {
          fournisseurs.slice(0, 5).forEach(f => {
            if (f.nom?.toLowerCase().includes(query) || f.prenom?.toLowerCase().includes(query)) {
              allResults.push({
                type: 'fournisseur',
                label: `${f.nom} ${f.prenom}`,
                description: f.email || '',
                id: f.id || 0,
                url: `detail-fournisseur/${f.id}`
              });
            }
          });
          completed++;
          if (completed === total) observer.next(allResults.slice(0, 20));
        },
        complete: () => { completed++; if (completed === total) observer.next(allResults.slice(0, 20)); }
      });

      this.categoryService.findAll().subscribe({
        next: (categories) => {
          categories.slice(0, 5).forEach(c => {
            if (c.code?.toLowerCase().includes(query) || c.designation?.toLowerCase().includes(query)) {
              allResults.push({
                type: 'categorie',
                label: c.code || '',
                description: c.designation || '',
                id: c.id || 0,
                url: `nouvel-categorie/${c.id}`
              });
            }
          });
          completed++;
          if (completed === total) observer.next(allResults.slice(0, 20));
        },
        complete: () => { completed++; if (completed === total) observer.next(allResults.slice(0, 20)); }
      });

      this.userService.findAll().subscribe({
        next: (users) => {
          users.slice(0, 5).forEach(u => {
            if (u.nom?.toLowerCase().includes(query) || u.prenom?.toLowerCase().includes(query)) {
              allResults.push({
                type: 'utilisateur',
                label: `${u.nom} ${u.prenom}`,
                description: u.email || '',
                id: u.id || 0,
                url: `utilisateurs`
              });
            }
          });
          completed++;
          if (completed === total) observer.next(allResults.slice(0, 20));
        },
        complete: () => { completed++; if (completed === total) observer.next(allResults.slice(0, 20)); }
      });

      this.venteService.findAllVente().subscribe({
        next: (ventes) => {
          ventes.slice(0, 5).forEach(v => {
            if (v.code?.toLowerCase().includes(query)) {
              allResults.push({
                type: 'vente',
                label: v.code || '',
                description: v.dateVente ? new Date(v.dateVente).toLocaleDateString('fr-FR') : '',
                id: v.id || 0,
                url: `liste-vente`
              });
            }
          });
          completed++;
          if (completed === total) {
            observer.next(allResults.slice(0, 20));
            observer.complete();
          }
        },
        complete: () => { completed++; if (completed === total) { observer.next(allResults.slice(0, 20)); observer.complete(); } }
      });
    });
  }
}
