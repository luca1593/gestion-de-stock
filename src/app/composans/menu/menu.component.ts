import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from './menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
[x: string]: any;

  public menuProperties : Array<Menu> = [
    {
      id: '1',
      icon: 'fa-solid fa-gauge',
      titre: 'Tableau de bord',
      url: '',
      sousMenus: [
        {
          id: '11',
          titre: 'Vue d\'ensemble',
          icon: 'fa-solid fa-chart-pie',
          url: ''
        },
        {
          id: '12',
          titre: 'Statistiques',
          icon: 'fa-solid fa-chart-line',
          url: 'statistiques'
        }
      ]
    },
    {
      id: '2',
      titre: 'Articles',
      icon: 'fa-solid fa-boxes-stacked',
      url: '',
      sousMenus: [
        {
          id: '21',
          titre: 'Articles',
          icon: 'fa-solid fa-cubes-stacked',
          url: 'articles'
        },
        {
          id: '22',
          titre: 'Mouvement de stock',
          icon: 'fa-solid fa-dolly',
          url: ''
        }
      ]
    },
    {
      id: '3',
      titre: 'Clients',
      icon: 'fa-solid fa-users-line',
      url: '',
      sousMenus: [
        {
          id: '31',
          titre: 'Clients',
          icon: 'fa-solid fa-users',
          url: ''
        },
        {
          id: '32',
          titre: 'Commande clients',
          icon: 'fa-solid fa-basket-shopping',
          url: ''
        }
      ]
    },
    {
      id: '4',
      titre: 'Fournisseurs',
      icon: 'fa-solid fa-users-between-lines',
      url: '',
      sousMenus: [
        {
          id: '41',
          titre: 'Fournisseurs',
          icon: 'fa-solid fa-users',
          url: ''
        },
        {
          id: '42',
          titre: 'Commande fournisseur',
          icon: 'fa-solid fa-truck',
          url: ''
        }
      ]
    },
    {
      id: '5',
      titre: 'Parametrages',
      icon: 'fa-solid fa-screwdriver-wrench',
      url: '',
      sousMenus: [
        {
          id: '51',
          titre: 'Categories',
          icon: 'fa-solid fa-gear',
          url: ''
        },
        {
          id: '52',
          titre: 'Utilisateurs',
          icon: 'fa-solid fa-users-gear',
          url: ''
        }
      ]
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(url ?: string){
    this.router.navigate([url]);
  }

}
