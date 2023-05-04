import { Component, OnInit } from '@angular/core';
import { BoutonCalc } from './bouton.calc';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public boutonCalcs: Array<BoutonCalc> = [
    { "txt": '7', "id": '7' },
    { "txt": '8', "id": '8' },
    { "txt": '9', "id": '9' },
    { "txt": '*', "id": '*' },
    { "txt": '4', "id": '4' },
    { "txt": '5', "id": '5' },
    { "txt": '6', "id": '6' },
    { "txt": '-', "id": '-' },
    { "txt": '1', "id": '1' },
    { "txt": '2', "id": '2' },
    { "txt": '3', "id": '3' },
    { "txt": '+', "id": '+' },
    { "txt": '.', "id": '.' },
    { "txt": '0', "id": '0' },
    { "txt": '=', "id": '=' },
    { "txt": '/', "id": '/' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
