import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ligne-action',
  template: `
    <div class="ligne-actions">
      <button class="btn-action btn-modifier" (click)="onModifier()" title="Modifier">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button class="btn-action btn-supprimer" (click)="onSupprimer()" title="Supprimer">
        <i class="fas fa-trash-alt"></i>
      </button>
      <button class="btn-action btn-details" (click)="onDetails()" title="Détails">
        <i class="fas fa-list-alt"></i>
      </button>
    </div>
  `,
  styles: [`
    .ligne-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .btn-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-action i {
      font-size: 0.85rem;
    }

    .btn-modifier {
      background: rgba(74, 144, 217, 0.15);
      color: #4a90d9;
    }

    .btn-modifier:hover {
      background: linear-gradient(135deg, #4a90d9, #2a5298);
      color: white;
    }

    .btn-supprimer {
      background: rgba(220, 53, 69, 0.15);
      color: #dc3545;
    }

    .btn-supprimer:hover {
      background: linear-gradient(135deg, #dc3545, #c82333);
      color: white;
    }

    .btn-details {
      background: rgba(108, 117, 125, 0.15);
      color: #6c757d;
    }

    .btn-details:hover {
      background: linear-gradient(135deg, #6c757d, #5a6268);
      color: white;
    }

    body.dark-theme .btn-modifier {
      background: rgba(74, 144, 217, 0.2);
    }

    body.dark-theme .btn-modifier:hover {
      background: #4a90d9;
    }

    body.dark-theme .btn-supprimer {
      background: rgba(220, 53, 69, 0.2);
    }

    body.dark-theme .btn-supprimer:hover {
      background: #dc3545;
    }

    body.dark-theme .btn-details {
      background: rgba(108, 117, 125, 0.2);
    }

    body.dark-theme .btn-details:hover {
      background: #6c757d;
    }

    @media (max-width: 576px) {
      .btn-action {
        width: 28px;
        height: 28px;
      }
      
      .btn-action i {
        font-size: 0.75rem;
      }
    }
  `]
})
export class LigneActionComponent {
  @Input() itemId?: number;
  @Output() modifier = new EventEmitter<number>();
  @Output() supprimer = new EventEmitter<number>();
  @Output() details = new EventEmitter<number>();

  onModifier(): void {
    this.modifier.emit(this.itemId);
  }

  onSupprimer(): void {
    this.supprimer.emit(this.itemId);
  }

  onDetails(): void {
    this.details.emit(this.itemId);
  }
}
