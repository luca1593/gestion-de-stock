import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  curentIndex = -1;
  page = 1; 
  count = 0;
  pageSize = 4;
  pageSizes = [3, 6, 9];

  constructor() { }

  ngOnInit(): void {
  }

}
