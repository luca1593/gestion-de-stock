import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  
  loading: boolean = false;
  error: string = 'Statistiques avancées non disponibles sur le serveur';

  constructor() { }

  ngOnInit(): void {
    // Les endpoints /v1/dashboard/inventory/stats, /v1/dashboard/analyse-stock, 
    // et /v1/dashboard/rotation-stock retournent 404
    // Ces fonctionnalités seront disponibles ultérieurement
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatPercent(value: number | undefined): string {
    if (value === undefined || value === null) return '0%';
    return value.toFixed(1) + '%';
  }

  getRotationClass(taux: number | undefined): string {
    if (!taux) return 'text-muted';
    if (taux >= 4) return 'text-success';
    if (taux >= 2) return 'text-warning';
    return 'text-danger';
  }
}
