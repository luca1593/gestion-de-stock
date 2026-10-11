import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { HaveurService } from 'src/app/services/avoir/avoir.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { UserService } from 'src/app/services/user/user.service';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';
import { Breadcrumb } from './model';

// Resolution dynamique du dernier element du fil : quel parametre lire,
// comment charger l'entite, comment en tirer un libelle. Quand le chargement
// echoue (ou que l'entite n'a pas de nom), le libelle statique de la route
// est conserve.
interface EntityLabelResolver {
  param: string;
  load: (id: number) => Observable<any>;
  labelOf: (entity: any) => string | null;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];

  private destroy$ = new Subject<void>();
  private labelSub?: Subscription;

  // Bonne pratique sans toucher aux URLs : les routes plates (ex. detail-article/:id
  // est soeur de articles, pas enfant) ne peuvent pas donner "Accueil > Articles > X"
  // via la seule hierarchie du routeur. Cette table declare le parent logique,
  // sans modifier ni les paths ni les navigations existantes.
  private static readonly LOGICAL_PARENTS: Record<string, Breadcrumb> = {
    'detail-article/:id': { label: 'Articles', url: '/articles' },
    'nouvel-article': { label: 'Articles', url: '/articles' },
    'nouvel-article/:idArticle': { label: 'Articles', url: '/articles' },
    'detail-client/:id': { label: 'Clients', url: '/clients' },
    'nouveau-client': { label: 'Clients', url: '/clients' },
    'nouveau-client/:id': { label: 'Clients', url: '/clients' },
    'commande-client/:id': { label: 'Commandes clients', url: '/commande-client' },
    'nouvel-commande-client': { label: 'Commandes clients', url: '/commande-client' },
    'nouvel-commande-client/:idCmd': { label: 'Commandes clients', url: '/commande-client' },
    'detail-fournisseur/:id': { label: 'Fournisseurs', url: '/fournisseurs' },
    'nouveau-fournisseur': { label: 'Fournisseurs', url: '/fournisseurs' },
    'nouveau-fournisseur/:id': { label: 'Fournisseurs', url: '/fournisseurs' },
    'commande-fournisseur/:id': { label: 'Commandes fournisseurs', url: '/commande-fournisseur' },
    'nouvel-commande-fournisseur': { label: 'Commandes fournisseurs', url: '/commande-fournisseur' },
    'nouvel-commande-fournisseur/:idCmd': { label: 'Commandes fournisseurs', url: '/commande-fournisseur' },
    'detail-mvtstk/:id': { label: 'Mouvements de stock', url: '/mvtstk' },
    'utilisateur/:id': { label: 'Utilisateurs', url: '/utilisateurs' },
    'nouvel-utilisateur': { label: 'Utilisateurs', url: '/utilisateurs' },
    'modifier-utilisateur/:id': { label: 'Utilisateurs', url: '/utilisateurs' },
    'nouvel-categorie': { label: 'Catégories', url: '/categories' },
    'nouvel-categorie/:idCategory': { label: 'Catégories', url: '/categories' },
    'nouvel-avoir': { label: 'Avoirs', url: '/avoirs' },
    'nouvel-avoir/:id': { label: 'Avoirs', url: '/avoirs' },
    'modifier-profil': { label: 'Profil', url: '/profil' },
    'changer-mot-de-passe': { label: 'Profil', url: '/profil' }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArtcleService,
    private cltfrsService: CltfrsService,
    private commandeService: CmdCltFrsService,
    private avoirService: HaveurService,
    private categoryService: CategoryService,
    private userService: UserService,
    private mvtstkService: MvtStkService
  ) {}

  ngOnInit(): void {
    // Construit des le premier affichage (cas refresh / acces direct),
    // puis a chaque fin de navigation.
    this.refresh();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.labelSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refresh(): void {
    this.labelSub?.unsubscribe();
    this.buildBreadcrumbs();
    this.resolveArticleLabel();
  }

  buildBreadcrumbs(): void {
    const trail: Breadcrumb[] = [];
    // Toujours partir de la racine du routeur (et non de this.route.parent) :
    // le composant vit dans le header, frere du router-outlet, donc this.route
    // pointe vers le shell dashboard et ne voit jamais les routes enfants.
    let route: ActivatedRoute | null = this.route.root;
    let url = '';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.outlet !== 'primary') {
        continue;
      }
      const segments = route.snapshot.url.map(segment => segment.path).join('/');
      if (segments) {
        url += `/${segments}`;
      }
      const data = route.snapshot.data?.['breadcrumb'];
      if (data) {
        const label = typeof data === 'string' ? data : data.label;
        const link = typeof data === 'string' ? (url || '/') : (data.url ?? url ?? '/');
        trail.push({ label, url: link });
      }
    }

    // Injecte le parent logique pour les routes plates (sans changer les URLs).
    const leafPath = this.getDeepestRoutePath();
    const logicalParent = leafPath ? BreadcrumbComponent.LOGICAL_PARENTS[leafPath] : undefined;
    if (logicalParent && !trail.some(b => b.label === logicalParent.label)) {
      // Insere juste avant le dernier element (la page courante).
      trail.splice(Math.max(trail.length - 1, 0), 0, logicalParent);
    }

    // Garantit "Accueil" en tete pour un fil coherent sur toutes les pages.
    if (trail.length === 0 || trail[0].label !== 'Accueil') {
      trail.unshift({ label: 'Accueil', url: '/dashbord' });
    }

    this.breadcrumbs = trail;
  }

  private getDeepestRoutePath(): string | null {
    let route: ActivatedRoute | null = this.route.root;
    let deepest: ActivatedRoute | null = null;
    while (route.firstChild) {
      route = route.firstChild;
      if (route.outlet === 'primary') {
        deepest = route;
      }
    }
    return deepest?.snapshot.routeConfig?.path ?? null;
  }

  private getDeepestRouteParams(): Params {
    let route: ActivatedRoute | null = this.route.root;
    let deepest: ActivatedRoute | null = null;
    while (route.firstChild) {
      route = route.firstChild;
      if (route.outlet === 'primary') {
        deepest = route;
      }
    }
    return deepest?.snapshot.params ?? {};
  }

  // Remplace le libelle statique par le nom de l'entite selectionnee
  // (article, client, commande...). En cas d'echec (entite supprimee, API
  // indispo), garde le libelle statique. En mode ajout (pas d'id dans l'URL),
  // le routage affiche deja "Nouveau/Nouvelle ...", il n'y a rien a resoudre.
  private resolveArticleLabel(): void {
    const leafPath = this.getDeepestRoutePath();
    const params = this.getDeepestRouteParams();
    if (!leafPath) {
      return;
    }
    const def = this.entityResolvers()[leafPath];
    if (!def) {
      return;
    }
    const rawId = params[def.param];
    const entityId = rawId != null ? Number(rawId) : NaN;
    if (isNaN(entityId)) {
      return;
    }
    this.labelSub = def.load(entityId).subscribe({
      next: (entity) => {
        const name = entity ? def.labelOf(entity) : null;
        if (name && this.breadcrumbs.length > 0) {
          this.breadcrumbs[this.breadcrumbs.length - 1] = {
            ...this.breadcrumbs[this.breadcrumbs.length - 1],
            label: name
          };
        }
      },
      error: () => { /* garde le libelle statique */ }
    });
  }

  private fullName(entity: any): string | null {
    const name = [entity?.nom, entity?.prenom].filter(Boolean).join(' ').trim();
    return name || null;
  }

  private trimOrNull(value: unknown): string | null {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || null;
  }

  private findInList(list$: Observable<any[]>, id: number): Observable<any> {
    return list$.pipe(map(list => (list || []).find(e => e?.id === id) ?? null));
  }

  private entityResolvers(): Record<string, EntityLabelResolver> {
    return {
      'detail-article/:id': {
        param: 'id',
        load: (id) => this.articleService.findArticleById(id),
        labelOf: (a) => this.trimOrNull(a?.designation)
      },
      'nouvel-article/:idArticle': {
        param: 'idArticle',
        load: (id) => this.articleService.findArticleById(id),
        labelOf: (a) => this.trimOrNull(a?.designation)
      },
      'detail-client/:id': {
        param: 'id',
        load: (id) => this.cltfrsService.findClientById(id),
        labelOf: (e) => this.fullName(e)
      },
      'nouveau-client/:id': {
        param: 'id',
        load: (id) => this.cltfrsService.findClientById(id),
        labelOf: (e) => this.fullName(e)
      },
      'detail-fournisseur/:id': {
        param: 'id',
        load: (id) => this.cltfrsService.findFournisseurById(id),
        labelOf: (e) => this.fullName(e)
      },
      'nouveau-fournisseur/:id': {
        param: 'id',
        load: (id) => this.cltfrsService.findFournisseurById(id),
        labelOf: (e) => this.fullName(e)
      },
      'commande-client/:id': {
        param: 'id',
        load: (id) => this.commandeService.findCommandeClientById(id),
        labelOf: (e) => this.trimOrNull(e?.code)
      },
      'commande-fournisseur/:id': {
        param: 'id',
        load: (id) => this.commandeService.findCommandeFournisseurById(id),
        labelOf: (e) => this.trimOrNull(e?.code)
      },
      'nouvel-avoir/:id': {
        param: 'id',
        load: (id) => this.avoirService.getById(id),
        labelOf: (e) => this.trimOrNull(e?.code)
      },
      'nouvel-categorie/:idCategory': {
        param: 'idCategory',
        load: (id) => this.findInList(this.categoryService.findAll(), id),
        labelOf: (e) => this.trimOrNull(e?.designation)
      },
      'utilisateur/:id': {
        param: 'id',
        load: (id) => this.findInList(this.userService.findAll(), id),
        labelOf: (e) => this.fullName(e)
      },
      'modifier-utilisateur/:id': {
        param: 'id',
        load: (id) => this.findInList(this.userService.findAll(), id),
        labelOf: (e) => this.fullName(e)
      },
      'detail-mvtstk/:id': {
        param: 'id',
        load: (id) => this.findInList(this.mvtstkService.findAll(), id),
        labelOf: (e) => this.trimOrNull(e?.article?.designation)
      }
    };
  }
}
