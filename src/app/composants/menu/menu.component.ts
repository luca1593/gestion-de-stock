import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Menu } from './menu';
import { UserService } from 'src/app/services/user/user.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() collapsed = false;
  @Output() itemClicked = new EventEmitter<void>();
  public isDarkMode = false;

  public menuProperties : Array<Menu>=[
    {
      id: '1',
      icon: 'fas fa-tachometer-alt',
      titre: 'Tableau de bord',
      url: '',
      sousMenus: [
        {
          id: '11',
          titre: 'Vue d\'ensemble',
          icon: 'fas fa-chart-pie',
          url: 'dashbord'
        },
        {
          id: '12',
          titre: 'Statistiques',
          icon: 'fas fa-chart-line',
          url: 'statistiques'
        }
      ]
    },
    {
      id: '2',
      titre: 'Articles',
      icon: 'fas fa-boxes',
      url: '',
      sousMenus: [
        {
          id: '21',
          titre: 'Articles',
          icon: 'fas fa-cube',
          url: 'articles',
          matchUrls: ['nouvel-article', 'detail-article']
        },
        {
          id: '22',
          titre: 'Mouvement de stock',
          icon: 'fas fa-dolly',
          url: 'mvtstk',
          matchUrls: ['detail-mvtstk']
        }
      ]
    },
    {
      id: '3',
      titre: 'Clients',
      icon: 'fas fa-user-friends',
      url: '',
      sousMenus: [
        {
          id: '31',
          titre: 'Clients',
          icon: 'fas fa-users',
          url: 'clients',
          matchUrls: ['nouveau-client', 'detail-client']
        },
        {
          id: '32',
          titre: 'Commande clients',
          icon: 'fas fa-shopping-basket',
          url: 'commande-client',
          matchUrls: ['nouvel-commande-client']
        }
      ]
    },
    {
      id: '4',
      titre: 'Fournisseurs',
      icon: 'fas fa-truck-loading',
      url: '',
      sousMenus: [
        {
          id: '41',
          titre: 'Fournisseurs',
          icon: 'fas fa-truck',
          url: 'fournisseurs',
          matchUrls: ['nouveau-fournisseur', 'detail-fournisseur']
        },
        {
          id: '42',
          titre: 'Commande fournisseur',
          icon: 'fas fa-clipboard-list',
          url: 'commande-fournisseur',
          matchUrls: ['nouvel-commande-fournisseur']
        }
      ]
    },
    {
      id: '5',
      titre: 'Ventes',
      icon: 'fas fa-cash-register',
      url: '',
      sousMenus: [
        {
          id: '51',
          titre: 'Nouvelle vente',
          icon: 'fas fa-dollar-sign',
          url: 'vente'
        },
        {
          id: '52',
          titre: 'Historique des ventes',
          icon: 'fas fa-history',
          url: 'liste-vente'
        },
        {
          id: '53',
          titre: 'Avoirs',
          icon: 'fas fa-receipt',
          url: 'avoirs',
          matchUrls: ['nouvel-avoir']
        }
      ]
    },
    {
      id: '6',
      titre: 'Paramètres',
      icon: 'fas fa-cogs',
      url: '',
      sousMenus: [
        {
          id: '61',
          titre: 'Catégories',
          icon: 'fas fa-tags',
          url: 'categories',
          matchUrls: ['nouvel-categorie']
        },
        {
          id: '62',
          titre: 'Utilisateurs',
          icon: 'fas fa-user-cog',
          url: 'utilisateurs',
          matchUrls: ['nouvel-utilisateur', 'modifier-utilisateur', 'utilisateur']
        }
      ]
    },
    {
      id: '7',
      titre: 'Déconnexion',
      icon: 'fas fa-sign-out-alt',
      url: 'logout'
    }
  ]

  private lastSelectedMenu : Menu | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private themeService: ThemeService
    ) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkModeChange$.subscribe(isDark => this.isDarkMode = isDark);
    this.setActiveMenuFromRoute(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setActiveMenuFromRoute(event.url);
    });
  }

  private setActiveMenuFromRoute(url: string): void {
    const currentUrl = url || '';
    const cleanUrl = currentUrl.split('?')[0].split('#')[0];
    // Premier segment : '/detail-article/19' -> 'detail-article'.
    // Comparaison exacte (pas de endsWith) pour eviter les faux positifs.
    const firstSegment = cleanUrl.split('/').filter(Boolean)[0] ?? '';

    this.menuProperties.forEach(menu => {
      menu.active = false;
      if (menu.sousMenus && menu.sousMenus.length > 0) {
        let hasActiveSubmenu = false;
        menu.sousMenus.forEach(sousMenu => {
          const sousMenuActive = this.isMenuEntryActive(sousMenu, firstSegment);
          sousMenu.active = sousMenuActive;
          if (sousMenuActive) hasActiveSubmenu = true;
        });
        menu.active = hasActiveSubmenu;
      } else if (menu.url) {
        menu.active = firstSegment === menu.url;
      }
    });
  }

  private isMenuEntryActive(entry: Menu, firstSegment: string): boolean {
    if (!firstSegment) {
      return false;
    }
    const candidates = [entry.url, ...(entry.matchUrls ?? [])].filter(Boolean) as string[];
    return candidates.some(candidate => firstSegment === candidate);
  }

  toggleMenu(menu: Menu): void {
    this.menuProperties.forEach(m => {
      m.active = false;
      if (m.sousMenus) {
        m.sousMenus.forEach(sm => sm.active = false);
      }
    });
    menu.active = true;
  }

  navigate(menu: Menu){
    const targetUrl = menu.url;
    this.menuProperties.forEach(m => {
      if (m.sousMenus && m.sousMenus.some(sm => sm.url === targetUrl)) {
        m.active = true;
        m.sousMenus.forEach(sm => {
          sm.active = (sm.url === targetUrl);
        });
      } else if (m.url === targetUrl) {
        m.active = true;
      } else {
        m.active = false;
        if (m.sousMenus) {
          m.sousMenus.forEach(sm => sm.active = false);
        }
      }
    });
    this.router.navigate([menu.url]);
    this.itemClicked.emit();
  }

  logoutApp(){
    this.userService.logout();
  }

}
