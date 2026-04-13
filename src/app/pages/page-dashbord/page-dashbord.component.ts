import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-page-dashbord',
  templateUrl: './page-dashbord.component.html',
  styleUrls: ['./page-dashbord.component.css']
})
export class PageDashbordComponent implements OnInit {

  dateDuJour: Date=new Date();
  public isDarkMode = false;
  
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkModeChange$.subscribe(isDark => this.isDarkMode = isDark);
    this.observableTimer();
  }

  observableTimer(){
    const source=timer(this.dateDuJour, 1000)
    .subscribe( v => {
      this.dateDuJour=new Date();
    })
  }

}
