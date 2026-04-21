import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ligne-action',
  template: `
    <div class="ligne-actions">
      <button class="btn-action btn-modifier" (click)="onModifier()" title="Modifier">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <div class="dropdown etat-dropdown">
        <span class="badge-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="badge" 
                [class.bg-warning]="etatcourant === 'EN_PREPARATION'"
                [class.bg-success]="etatcourant === 'VALIDEE'"
                [class.bg-info]="etatcourant === 'LIVREE'"
                [class.text-dark]="etatcourant === 'LIVREE'">
            {{ getLibellecourt(etatcourant) }}
          </span>
        </span>
        <ul class="dropdown-menu etat-menu">
          <li><a class="dropdown-item" (click)="onChangeEtat('EN_PREPARATION')">
            <span class="badge bg-warning text-dark">EN_PREPARATION</span>
          </a></li>
          <li><a class="dropdown-item" (click)="onChangeEtat('VALIDEE')">
            <span class="badge bg-success">VALIDEE</span>
          </a></li>
          <li><a class="dropdown-item" (click)="onChangeEtat('LIVREE')">
            <span class="badge bg-info text-dark">LIVREE</span>
          </a></li>
        </ul>
      </div>
      <button class="btn-action btn-supprimer" (click)="onSupprimer()" title="Supprimer">
        <i class="fas fa-trash-alt"></i>
      </button>
      <button class="btn-action btn-details" (click)="onDetails()" title="Détails">
        <i class="fas fa-list-alt"></i>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    .ligne-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.15rem;
    }

    .btn-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-action i {
      font-size: 0.65rem;
    }

    .btn-modifier {
      background: rgba(74,144,217,0.15);
      color: #4a90d9;
    }

    .btn-modifier:hover {
      background: linear-gradient(135deg, #4a90d9, #2a5298);
      color: white;
    }

    .btn-supprimer {
      background: rgba(220,53,69,0.15);
      color: #dc3545;
    }

    .btn-supprimer:hover {
      background: linear-gradient(135deg, #dc3545, #c82333);
      color: white;
    }

    .btn-details {
      background: rgba(108,117,125,0.15);
      color: #6c757d;
    }

    .btn-details:hover {
      background: linear-gradient(135deg, #6c757d, #5a6268);
      color: white;
    }

    .etat-dropdown {
      position: relative;
    }

    .badge-dropdown {
      cursor: pointer;
      display: inline-block;
    }

    .badge-dropdown .badge {
      padding: 0.2rem 0.4rem;
      font-size: 0.6rem;
      border-radius: 3px;
      transition: all 0.15s ease;
    }

    .badge-dropdown:hover .badge {
      filter: brightness(0.9);
    }

    .etat-menu {
      font-size: 0.7rem;
      min-width: 90px;
    }

    .etat-menu .dropdown-item {
      padding: 0.3rem 0.5rem;
      cursor: pointer;
      text-align: center;
    }

    .etat-menu .dropdown-item:hover {
      background-color: #f8f9fa;
    }

    .etat-menu .dropdown-item .badge {
      font-size: 0.6rem;
    }

    body.dark-theme .etat-menu {
      background: #2d2d2d;
      border-color: #404040;
    }

    body.dark-theme .etat-menu .dropdown-item:hover {
      background-color: #3a3a3a;
    }

    @media (max-width: 576px) {
      .btn-action {
        width: 20px;
        height: 20px;
      }
      
      .btn-action i {
        font-size: 0.55rem;
      }
    }
  `]
})
export class LigneActionComponent {
  @Input() itemId?: number;
  @Input() etatcourant?: string;
  @Output() modifier = new EventEmitter<number>();
  @Output() supprimer = new EventEmitter<number>();
  @Output() details = new EventEmitter<number>();
  @Output() changeEtat = new EventEmitter<{id: number, etat: string}>();

  getLibellecourt(etat: string | undefined): string {
    if (!etat) return 'EN_ATT';
    const etats: {[key: string]: string} = {
      'EN_PREPARATION': 'EN_ATT',
      'VALIDEE': 'VAL',
      'LIVREE': 'LIVR'
    };
    return etats[etat] || etat.substring(0, 4);
  }

  onModifier(): void {
    this.modifier.emit(this.itemId);
  }

  onSupprimer(): void {
    this.supprimer.emit(this.itemId);
  }

  onDetails(): void {
    this.details.emit(this.itemId);
  }

  onChangeEtat(etat: string): void {
    if (this.itemId && etat !== this.etatcourant) {
      this.changeEtat.emit({ id: this.itemId, etat: etat });
    }
  }
}