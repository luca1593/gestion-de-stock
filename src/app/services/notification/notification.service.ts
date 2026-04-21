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
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private nextId = 1;

  constructor(
    private alertStockService: AlertStockService,
    private commandeService: CmdCltFrsService,
    private userService: UserService
  ) {}

  loadNotifications(): void {
    this.checkAlertsStock();
    this.checkCommandesEnAttente();
  }

  private checkAlertsStock(): void {
    const entrepriseId = this.userService.getConnectedUser().entreprise?.id;
    if (!entrepriseId) return;

    this.alertStockService.AlertStockApiFindActivesGET(entrepriseId).pipe(
      map((alerts: AlertStockDto[]) => alerts.filter(a => a.active)),
      catchError(() => [])
    ).subscribe(alerts => {
      alerts.forEach((alert: AlertStockDto) => {
        const existing = this.notifications.find(n => 
          n.type === 'warning' && n.title.includes(alert.designation || '')
        );
        if (!existing && alert.designation) {
          const niveau = alert.niveauAlerte === 'CRITIQUE' ? '🔴 Critique' : 
                        alert.niveauAlerte === 'BAS' ? '🟡 Bas' : '🔵 Moyen';
          this.addNotification(
            'warning',
            `${niveau} - Stock`,
            `${alert.designation}: ${alert.stockActuel} unités (seuil: ${alert.seuilMinimum})`,
            '/articles'
          );
        }
      });
    });
  }

  private checkCommandesEnAttente(): void {
    this.commandeService.findAllCommandeClient().pipe(
      map(cmds => cmds.filter((c: CommandeClientDto) => c.etatcommande === 'EN_PREPARATION')),
      catchError(() => [])
    ).subscribe(commandes => {
      commandes.forEach((cmd: CommandeClientDto) => {
        const existing = this.notifications.find(n => n.link?.includes(`/commande-client/${cmd.id}`));
        if (!existing && cmd.id) {
          this.addNotification('info', 'Commande client', `Cmd ${cmd.code} en attente`, `/commande-client/${cmd.id}`);
        }
      });
    });

    this.commandeService.findAllCommandeFournisseur().pipe(
      map(cmds => cmds.filter((c: CommandeFournisseurDto) => c.etatcommande === 'EN_PREPARATION')),
      catchError(() => [])
    ).subscribe(commandes => {
      commandes.forEach((cmd: CommandeFournisseurDto) => {
        const existing = this.notifications.find(n => n.link?.includes(`/commande-fournisseur/${cmd.id}`));
        if (!existing && cmd.id) {
          this.addNotification(
            'info',
            'Commande fournisseur',
            `Cmd ${cmd.code} en attente`,
            `/commande-fournisseur/${cmd.id}`
          );
        }
      });
    });
  }

  addNotification(type: Notification['type'], title: string, message: string, link?: string): void {
    const notification: Notification = {
      id: this.nextId++,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      link
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
      this.notificationsSubject.next([...this.notifications]);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
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
}