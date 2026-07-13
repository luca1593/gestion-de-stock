import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-page-dashbord',
  templateUrl: './page-dashbord.component.html',
  styleUrls: ['./page-dashbord.component.css']
})
export class PageDashbordComponent implements OnInit, OnDestroy {

  dateDuJour: Date=new Date();
  public isDarkMode = false;
  public menuCollapsed = false;
  
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkModeChange$.pipe(takeUntil(this.destroy$)).subscribe(isDark => this.isDarkMode = isDark);
    this.observableTimer();
  }

  observableTimer(){
    const source=timer(this.dateDuJour, 1000)
    .pipe(takeUntil(this.destroy$))
    .subscribe( v => {
      this.dateDuJour=new Date();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void {
    this.menuCollapsed = !this.menuCollapsed;
  }

}
