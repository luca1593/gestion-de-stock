import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PhotoUpdate {
  entityType: 'client' | 'fournisseur' | 'article' | 'utilisateur' | 'entreprise';
  entityId: number;
  photoUrl: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoSyncService {
  private readonly STORAGE_KEY = 'gs_photo_updates';
  private photoUpdatesSubject = new BehaviorSubject<Map<string, string>>(new Map());
  photoUpdates$ = this.photoUpdatesSubject.asObservable();

  private updates: Map<string, string> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private getKey(entityType: string, entityId: number): string {
    return `${entityType}_${entityId}`;
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const items: PhotoUpdate[] = JSON.parse(stored);
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        this.updates = new Map();
        items.forEach(item => {
          if (now - item.timestamp < fiveMinutes) {
            this.updates.set(this.getKey(item.entityType, item.entityId), item.photoUrl);
          }
        });
      }
    } catch {
      // Ignore parse errors
    }
    this.photoUpdatesSubject.next(new Map(this.updates));
  }

  saveToStorage(): void {
    try {
      const items: PhotoUpdate[] = [];
      this.updates.forEach((url, key) => {
        const [entityType, entityIdStr] = key.split('_');
        items.push({
          entityType: entityType as PhotoUpdate['entityType'],
          entityId: parseInt(entityIdStr),
          photoUrl: url,
          timestamp: Date.now()
        });
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }

  updatePhoto(entityType: PhotoUpdate['entityType'], entityId: number, photoUrl: string): void {
    const key = this.getKey(entityType, entityId);
    this.updates.set(key, photoUrl);
    this.saveToStorage();
    this.photoUpdatesSubject.next(new Map(this.updates));
  }

  getPhotoUrl(entityType: PhotoUpdate['entityType'], entityId: number): string | null {
    const key = this.getKey(entityType, entityId);
    return this.updates.get(key) || null;
  }

  mergePhotos<T extends { id?: number; photo?: string }>(
    entityType: PhotoUpdate['entityType'],
    items: T[]
  ): T[] {
    return items.map(item => {
      if (item.id) {
        const updatedPhoto = this.getPhotoUrl(entityType, item.id);
        if (updatedPhoto) {
          return { ...item, photo: updatedPhoto };
        }
      }
      return item;
    });
  }

  clearEntity(entityType: PhotoUpdate['entityType'], entityId: number): void {
    const key = this.getKey(entityType, entityId);
    this.updates.delete(key);
    this.saveToStorage();
    this.photoUpdatesSubject.next(new Map(this.updates));
  }

  clearAll(): void {
    this.updates.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    this.photoUpdatesSubject.next(new Map());
  }
}
