import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: Map<string, any> = new Map();
  private isOpening: Map<string, boolean> = new Map();

  openModal(modalId: string): void {
    if (!modalId || this.isOpening.get(modalId)) return;
    this.isOpening.set(modalId, true);
    
    setTimeout(() => {
      this.isOpening.set(modalId, false);
    }, 150);

    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
      console.warn(`Modal "${modalId}" not found`);
      return;
    }

    try {
      let bsModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      
      if (!bsModal) {
        bsModal = new (window as any).bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: true,
          focus: true
        });
        this.modals.set(modalId, bsModal);
      }
      
      if (!bsModal._isShown) {
        bsModal.show();
      }
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  closeModal(modalId: string): void {
    if (!modalId) return;
    
    const bsModal = this.modals.get(modalId);
    if (bsModal && bsModal._isShown) {
      try {
        bsModal.hide();
      } catch (error) {
        console.error('Error closing modal:', error);
      }
    }
  }

  disposeModal(modalId: string): void {
    if (!modalId) return;
    
    const bsModal = this.modals.get(modalId);
    if (bsModal) {
      try {
        if (bsModal._isShown) {
          bsModal.hide();
        }
        bsModal.dispose();
      } catch (error) {}
      this.modals.delete(modalId);
    }
  }

  disposeAllModals(): void {
    document.querySelectorAll('.modal.show').forEach((el) => {
      try {
        const m = (window as any).bootstrap.Modal.getInstance(el);
        if (m) m.hide();
        m.dispose();
      } catch (e) {}
    });
    this.modals.clear();
  }
}