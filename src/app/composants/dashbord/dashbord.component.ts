import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {


  toggleProBanner(event: { preventDefault: () => void; }) {
    console.log("123");
    event.preventDefault();
    //document.querySelector('body').classList.toggle('removeProbanner');
  }

  constructor() { }

  ngOnInit() {
  }

  date: Date = new Date();

  visitSaleChartData = [{
    label: 'CHN',
    data: [20, 40, 15, 35, 25, 50, 30, 20],
    borderWidth: 1,
    fill: false,
  },
  {
    label: 'USA',
    data: [40, 30, 20, 10, 50, 15, 35, 40],
    borderWidth: 1,
    fill: false,
  },
  {
    label: 'UK',
    data: [70, 10, 30, 40, 25, 50, 15, 30],
    borderWidth: 1,
    fill: false,
  }];

  visitSaleChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  createChart(id: string, data: Array<number>, label: Array<string>): void {
    const cmdCltChart = new Chart(id, {
      type: 'pie',
      data: {
        labels: label,
        datasets: [{
          label: ' Quantités',
          data: data,
          borderWidth: 1
        }]
      }
    });
  }

}
