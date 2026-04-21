import { Component, Input, Output, EventEmitter } from '@angular/core';

interface WorkflowStep {
  key: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-etat-workflow',
  template: `
    <div class="etat-workflow" [class.compact]="compact" [class.horizontal]="!vertical" [class.vertical]="vertical">
      <div class="workflow-steps" *ngIf="!compact">
        <div class="step" 
             *ngFor="let step of steps; let i = index"
             [class.completed]="getStepIndex(etat) > i"
             [class.active]="getStepIndex(etat) === i"
             [class.pending]="getStepIndex(etat) < i"
             (click)="onStepClick(step, i)">
          <div class="step-indicator">
            <div class="step-circle">
              <i *ngIf="getStepIndex(etat) > i" class="fas fa-check"></i>
              <i *ngIf="getStepIndex(etat) <= i" [class]="step.icon"></i>
            </div>
            <div class="step-connector" *ngIf="i < steps.length - 1"></div>
          </div>
          <div class="step-content">
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>
      </div>
      <div class="etat-badge" *ngIf="compact">
        <span class="badge" 
              [class.bg-warning]="etat === 'EN_PREPARATION'"
              [class.bg-success]="etat === 'VALIDEE'"
              [class.bg-info]="etat === 'LIVREE'"
              [class.text-dark]="etat === 'LIVREE'">
          <i class="fas" [class]="getCurrentStep()?.icon"></i>
          <span class="ms-1">{{ getLibelle() }}</span>
        </span>
        <div class="dropdown">
          <button class="btn-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-chevron-down"></i>
          </button>
          <ul class="dropdown-menu">
            <li *ngFor="let step of steps">
              <a class="dropdown-item" (click)="onChange(step.key)" [class.active]="etat === step.key">
                <span class="badge" [style.background-color]="step.color">{{ step.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .etat-workflow {
      width: 100%;
    }

    .workflow-steps {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    .workflow-steps.horizontal {
      flex-direction: row;
    }

    .workflow-steps.vertical {
      flex-direction: column;
    }

    .step {
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      flex: 1;
    }

    .workflow-steps.horizontal .step {
      flex-direction: column;
    }

    .workflow-steps.vertical .step {
      flex-direction: row;
    }

    .step-indicator {
      position: relative;
      display: flex;
      align-items: center;
    }

    .workflow-steps.horizontal .step-indicator {
      width: 100%;
    }

    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e9ecef;
      color: #6c757d;
      font-size: 0.75rem;
      transition: all 0.3s ease;
      z-index: 1;
    }

    .step.completed .step-circle {
      background: #20c997;
      color: white;
    }

    .step.active .step-circle {
      background: #ffc107;
      color: #212529;
      box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.25);
      animation: pulse 2s infinite;
    }

    .step.pending .step-circle {
      background: #f8f9fa;
      color: #adb5db;
    }

    .step-connector {
      position: absolute;
      height: 3px;
      background: #e9ecef;
      z-index: 0;
    }

    .workflow-steps.horizontal .step-connector {
      width: 100%;
      left: 50%;
      top: 16px;
    }

    .workflow-steps.horizontal .step:last-child .step-connector {
      display: none;
    }

    .step.completed .step-connector {
      background: #20c997;
    }

    .step-content {
      margin-top: 8px;
      text-align: center;
    }

    .workflow-steps.vertical .step-content {
      margin-top: 0;
      margin-left: 8px;
    }

    .step-label {
      font-size: 0.7rem;
      color: #6c757d;
      font-weight: 500;
    }

    .step.completed .step-label {
      color: #20c997;
    }

    .step.active .step-label {
      color: #ffc107;
      font-weight: 600;
    }

    .etat-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .etat-badge .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.3rem 0.6rem;
      font-size: 0.75rem;
      border-radius: 4px;
    }

    .btn-dropdown {
      background: none;
      border: none;
      padding: 0.2rem 0.4rem;
      cursor: pointer;
      color: #6c757d;
      transition: color 0.2s;
    }

    .btn-dropdown:hover {
      color: #495057;
    }

    .dropdown-menu {
      font-size: 0.75rem;
      min-width: 120px;
    }

    .dropdown-item {
      cursor: pointer;
      padding: 0.4rem 0.75rem;
    }

    .dropdown-item:hover {
      background-color: #f8f9fa;
    }

    body.dark-theme .step-circle {
      background: #3a3a3a;
      color: #6c757d;
    }

    body.dark-theme .step.completed .step-circle {
      background: #20c997;
    }

    body.dark-theme .step.active .step-circle {
      background: #ffc107;
    }

    body.dark-theme .step.active .step-circle {
      box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3);
    }

    body.dark-theme .step.pending .step-circle {
      background: #2d2d2d;
      color: #4a4a4a;
    }

    body.dark-theme .step-connector {
      background: #3a3a3a;
    }

    body.dark-theme .dropdown-menu {
      background: #2d2d2d;
      border-color: #404040;
    }

    body.dark-theme .dropdown-item:hover {
      background-color: #3a3a3a;
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.25);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(255, 193, 7, 0.1);
      }
    }

    @media (max-width: 576px) {
      .step-circle {
        width: 24px;
        height: 24px;
        font-size: 0.6rem;
      }

      .step-label {
        font-size: 0.6rem;
      }
    }
  `]
})
export class EtatoWorkflowComponent {
  @Input() etat: string = 'EN_PREPARATION';
  @Input() compact: boolean = true;
  @Input() vertical: boolean = false;
  @Output() etatChange = new EventEmitter<string>();

  steps: WorkflowStep[] = [
    { key: 'EN_PREPARATION', label: 'En preparation', icon: 'fa-box', color: '#ffc107' },
    { key: 'VALIDEE', label: 'Validee', icon: 'fa-check', color: '#20c997' },
    { key: 'LIVREE', label: 'Livree', icon: 'fa-truck', color: '#0dcaf0' }
  ];

  getStepIndex(etat: string): number {
    return this.steps.findIndex(s => s.key === etat);
  }

  getCurrentStep(): WorkflowStep | undefined {
    return this.steps.find(s => s.key === this.etat);
  }

  getLibelle(): string {
    const step = this.getCurrentStep();
    return step ? step.label : this.etat;
  }

  onStepClick(step: WorkflowStep, index: number): void {
    if (index < this.getStepIndex(this.etat)) {
      this.onChange(step.key);
    }
  }

  onChange(newEtat: string): void {
    if (newEtat !== this.etat) {
      this.etatChange.emit(newEtat);
    }
  }
}