import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-page-dashbord',
  templateUrl: './page-dashbord.component.html',
  styleUrls: ['./page-dashbord.component.css']
})
export class PageDashbordComponent implements OnInit, OnDestroy {

  public isDarkMode = false;
  public menuCollapsed = false;
  public sidebarOpen = false;

  // Le rail réduit n'a de sens qu'au bureau : sous 992px le menu est un tiroir.
  private readonly mobileQuery: MediaQueryList =
    window.matchMedia('(max-width: 992px)');

  private readonly onMobileChange = (event: MediaQueryListEvent): void => {
    if (event.matches && this.menuCollapsed) {
      this.menuCollapsed = false;
    }
  };

  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService
    ) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkModeChange$.pipe(takeUntil(this.destroy$)).subscribe(isDark => this.isDarkMode = isDark);
    this.sidebarService.open$.pipe(takeUntil(this.destroy$)).subscribe(open => this.sidebarOpen = open);

    // Au passage sous 992px, on repart du menu déployé pour éviter qu'un rail
    // réduit laissé par une session bureau ne traîne dans le tiroir.
    if (this.mobileQuery.matches && this.menuCollapsed) {
      this.menuCollapsed = false;
    }
    this.mobileQuery.addEventListener('change', this.onMobileChange);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.onMobileChange);
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void {
    this.menuCollapsed = !this.menuCollapsed;
  }

  // En mobile : ferme le menu au clic sur le fond, sans naviguer.
  fermerSidebar(): void {
    this.sidebarService.close();
  }

}
