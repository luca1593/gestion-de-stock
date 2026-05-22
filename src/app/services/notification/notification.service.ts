import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlertStockDto, CommandeClientDto, CommandeFournisseurDto } from 'src/gs-api/src/models';
import { AlertStockService } from 'src/gs-api/src/services/alert-stock.service';
import { CmdCltFrsService } from '../cmdcltfrs/cmd-clt-frs.service';
import { UserService } from '../user/user.service';

export interface Notification {
  id: number;
  type: 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  entrepriseId?: number;
  dismissKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private nextId = 1;
  private currentEntrepriseId: number | null = null;
  private readonly DISMISSED_KEY = 'gs_dismissed_notifications';

  constructor(
    private alertStockService: AlertStockService,
    private commandeService: CmdCltFrsService,
    private userService: UserService
  ) {}

  private getDismissedKeys(): Set<string> {
    try {
      const stored = localStorage.getItem(this.DISMISSED_KEY);
      if (stored) {
        return new Set(JSON.parse(stored) as string[]);
      }
    } catch {
      // Ignore parse errors
    }
    return new Set<string>();
  }

  private saveDismissedKey(key: string): void {
    const dismissed = this.getDismissedKeys();
    dismissed.add(key);
    localStorage.setItem(this.DISMISSED_KEY, JSON.stringify(Array.from(dismissed)));
  }

  private isDismissed(key: string): boolean {
    return this.getDismissedKeys().has(key);
  }

  loadNotifications(): void {
    const entrepriseId = this.userService.getConnectedUser().entreprise?.id;
    if (!entrepriseId) return;

    if (this.currentEntrepriseId !== entrepriseId) {
      this.currentEntrepriseId = entrepriseId;
      this.notifications = [];
      this.notificationsSubject.next([]);
    }

    this.checkAlertsStock(entrepriseId);
    this.checkCommandesEnAttente(entrepriseId);
  }

  private checkAlertsStock(entrepriseId: number): void {
    this.alertStockService.AlertStockApiFindActivesGET(entrepriseId).pipe(
      map((alerts: AlertStockDto[]) => alerts.filter(a => a.active)),
      catchError(() => [])
    ).subscribe(alerts => {
      alerts.forEach((alert: AlertStockDto) => {
        const dismissKey = `alert-stock-${alert.articleId}-${entrepriseId}`;
        if (alert.designation && !this.isDismissed(dismissKey)) {
          const existing = this.notifications.find(n => 
            n.entrepriseId === entrepriseId &&
            n.dismissKey === dismissKey
          );
          if (!existing) {
            const niveau = alert.niveauAlerte === 'CRITIQUE' ? '🔴 Critique' : 
                          alert.niveauAlerte === 'FAIBLE' ? '🟡 Faible' : '🔵 Moyen';
            this.addNotification(
              'warning',
              `${niveau} - Stock`,
              `${alert.designation}: ${alert.stockActuel} unités (seuil: ${alert.seuilMinimum})`,
              '/articles',
              entrepriseId,
              dismissKey
            );
          }
        }
      });
    });
  }

  private checkCommandesEnAttente(entrepriseId: number): void {
    this.commandeService.findAllCommandeClient().pipe(
      map(cmds => cmds.filter((c: CommandeClientDto) => c.etatcommande === 'EN_PREPARATION')),
      catchError(() => [])
    ).subscribe(commandes => {
      commandes.forEach((cmd: CommandeClientDto) => {
        if (cmd.id) {
          const dismissKey = `commande-client-${cmd.id}-${entrepriseId}`;
          if (!this.isDismissed(dismissKey)) {
            const existing = this.notifications.find(n => 
              n.entrepriseId === entrepriseId &&
              n.dismissKey === dismissKey
            );
            if (!existing) {
              this.addNotification('info', 'Commande client', `Cmd ${cmd.code} en attente`, `/commande-client/${cmd.id}`, entrepriseId, dismissKey);
            }
          }
        }
      });
    });

    this.commandeService.findAllCommandeFournisseur().pipe(
      map(cmds => cmds.filter((c: CommandeFournisseurDto) => c.etatcommande === 'EN_PREPARATION')),
      catchError(() => [])
    ).subscribe(commandes => {
      commandes.forEach((cmd: CommandeFournisseurDto) => {
        if (cmd.id) {
          const dismissKey = `commande-fournisseur-${cmd.id}-${entrepriseId}`;
          if (!this.isDismissed(dismissKey)) {
            const existing = this.notifications.find(n => 
              n.entrepriseId === entrepriseId &&
              n.dismissKey === dismissKey
            );
            if (!existing) {
              this.addNotification(
                'info',
                'Commande fournisseur',
                `Cmd ${cmd.code} en attente`,
                `/commande-fournisseur/${cmd.id}`,
                entrepriseId,
                dismissKey
              );
            }
          }
        }
      });
    });
  }

  addNotification(type: Notification['type'], title: string, message: string, link?: string, entrepriseId?: number, dismissKey?: string): void {
    const notification: Notification = {
      id: this.nextId++,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      link,
      entrepriseId,
      dismissKey
    };
    this.notifications.unshift(notification);
    this.notificationsSubject.next([...this.notifications]);
  }

  addInfo(title: string, message: string): void {
    this.addNotification('info', title, message);
  }

  addWarning(title: string, message: string): void {
    this.addNotification('warning', title, message);
  }

  addSuccess(title: string, message: string): void {
    this.addNotification('info', title, message);
  }

  addError(title: string, message: string): void {
    this.addNotification('warning', title, message);
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      if (notification.dismissKey) {
        this.saveDismissedKey(notification.dismissKey);
      }
      this.notificationsSubject.next([...this.notifications]);
    }
  }

  dismissNotification(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && notification.dismissKey) {
      this.saveDismissedKey(notification.dismissKey);
    }
    this.removeNotification(id);
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => {
      n.read = true;
      if (n.dismissKey) {
        this.saveDismissedKey(n.dismissKey);
      }
    });
    this.notificationsSubject.next([...this.notifications]);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  clearAll(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }

  clearDismissedHistory(): void {
    localStorage.removeItem(this.DISMISSED_KEY);
  }
}
