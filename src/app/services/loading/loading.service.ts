import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private pendingRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private loadingMessageSubject = new BehaviorSubject<string>('Chargement...');
  loadingMessage$ = this.loadingMessageSubject.asObservable();

  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  show(message: string = 'Chargement...'): void {
    this.pendingRequests++;
    if (!this.loadingSubject.value) {
      this.loadingMessageSubject.next(message);
      this.loadingSubject.next(true);
      this.progressSubject.next(0);
    }
  }

  hide(): void {
    if (this.pendingRequests > 0) {
      this.pendingRequests--;
    }
    if (this.pendingRequests === 0 && this.loadingSubject.value) {
      this.loadingSubject.next(false);
      setTimeout(() => {
        if (this.pendingRequests === 0) {
          this.progressSubject.next(0);
        }
      }, 300);
    }
  }

  setMessage(message: string): void {
    this.loadingMessageSubject.next(message);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  reset(): void {
    this.pendingRequests = 0;
    this.loadingSubject.next(false);
    this.progressSubject.next(0);
  }
}