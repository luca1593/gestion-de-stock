import { Component, Input, OnInit } from '@angular/core';
import { MvtStkDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-mvtstk',
  templateUrl: './detail-mvtstk.component.html',
  styleUrls: ['./detail-mvtstk.component.css']
})
export class DetailMvtstkComponent implements OnInit {

  @Input()
  mvtStk: MvtStkDto = {};

  constructor() { }

  ngOnInit(): void {
  }

}
