import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-page-dashbord',
  templateUrl: './page-dashbord.component.html',
  styleUrls: ['./page-dashbord.component.css']
})
export class PageDashbordComponent implements OnInit {

  dateDuJour: Date = new Date();
  
  constructor() { }

  ngOnInit(): void {
    this.observableTimer();
  }

  observableTimer(){
    const source = timer(this.dateDuJour, 1000)
    .subscribe( v => {
      this.dateDuJour = new Date();
    })
  }

}
