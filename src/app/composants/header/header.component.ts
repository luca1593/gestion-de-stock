import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurDto } from 'src/gs-api/src/models';
import { ThemeService, Theme } from 'src/app/services/theme/theme.service';
import { SearchService, SearchResult } from 'src/app/services/search/search.service';
import { RouteContextService } from 'src/app/services/search/route-context.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService, Notification } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  connectedUser: UtilisateurDto={};
  showNotifications=false;
  currentTheme: Theme='light';
  private destroy$ = new Subject<void>();
  userLoading = true;

  notifications: Notification[] = [];
  unreadCount = 0;

  searchQuery = '';
  searchResults: SearchResult[] = [];
  showSearchResults = false;
  isSearching = false;

  showSessionWarning = false;
  sessionWarningMessage = '';

  private notificationDropdown: HTMLElement | null = null;

  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private searchService: SearchService,
    private routeContextService: RouteContextService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
    this.userLoading = !(this.connectedUser && this.connectedUser.id);
    
    this.userService.connectedUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user && user.id) {
        this.connectedUser = user;
        this.userLoading = false;
      }
    });
    this.currentTheme = this.themeService.getTheme();
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.currentTheme = theme;
    });

    this.authService.tokenExpirationWarning$.pipe(takeUntil(this.destroy$)).subscribe(warning => {
      if (warning) {
        this.showSessionWarning = true;
        this.sessionWarningMessage = 'Votre session expire dans moins de 5 minutes. Sauvegardez votre travail.';
      } else {
        this.showSessionWarning = false;
      }
    });

    this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = this.notificationService.getUnreadCount();
    });

    this.notificationService.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (this.showNotifications) {
      const notificationWrapper = target.closest('.notification-wrapper');
      const notificationDropdown = target.closest('.notification-dropdown');
      
      if (!notificationWrapper && !notificationDropdown) {
        this.showNotifications = false;
      }
    }
  }

  dismissSessionWarning(): void {
    this.showSessionWarning = false;
    this.authService.dismissWarning();
  }

  onSearchInput(): void {
    if (this.searchQuery.length < 2) {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    this.isSearching = true;
    const context = this.routeContextService.getCurrentContext();

    this.searchService.search(this.searchQuery, context).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSearchResults = results.length > 0;
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
        this.showSearchResults = false;
      }
    });
  }

  onSearchFocus(): void {
    if (this.searchQuery.length >= 2 && this.searchResults.length > 0) {
      this.showSearchResults = true;
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }

  selectResult(result: SearchResult): void {
    window.location.href = result.url;
    this.searchQuery = '';
    this.showSearchResults = false;
  }

  getResultIcon(type: string): string {
    const icons: {[key: string]: string} = {
      article: 'fas fa-cube',
      client: 'fas fa-user',
      fournisseur: 'fas fa-truck',
      categorie: 'fas fa-tag',
      utilisateur: 'fas fa-user-cog',
      vente: 'fas fa-shopping-cart',
      commande: 'fas fa-clipboard-list'
    };
    return icons[type] || 'fas fa-search';
  }

  getUserInitials(): string {
    const nom=this.connectedUser.nom || '';
    const prenom=this.connectedUser.prenom || '';
    if (nom && prenom) {
      return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
    }
    return nom ? nom.charAt(0).toUpperCase() : 'U';
  }

  toggleNotifications(): void {
    this.showNotifications=!this.showNotifications;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  markAsRead(notification: Notification, event: MouseEvent): void {
    event.stopPropagation();
    this.notificationService.markAsRead(notification.id);
    if (notification.link) {
      this.showNotifications = false;
      this.router.navigateByUrl(notification.link);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  getNotificationIcon(type: string): string {
    const icons: {[key: string]: string} = {
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
      error: 'fas fa-times-circle'
    };
    return icons[type] || 'fas fa-bell';
  }

  getNotificationClass(type: string): string {
    return `text-${type}`;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Maintenant';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  }
}