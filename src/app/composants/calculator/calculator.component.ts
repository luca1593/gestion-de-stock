import { Component, OnInit } from '@angular/core';
import { BoutonCalc } from './bouton.calc';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  firstNumber : number = 0;
  secondNumber : number = 0;
  numberText : string = "0";
  ops : string [] = ['+', '-', '*', '/'];
  operator : string = "";

  public boutonCalcs: Array<BoutonCalc> = [
    { "txt": 'AC', "id": 'ac' },
    { "txt": 'C', "id": 'c' },
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

  typeNumber(num : string) : void {
    if(num == "=") {
      this.secondNumber = +this.numberText;
      this.numberText ="" + this.calculateNumber(this.firstNumber, this.secondNumber, this.operator);
      this.firstNumber = 0;
      this.secondNumber = 0;
    } else if (this.ops.includes(num)) {
      if (this.firstNumber == 0) {
        this.firstNumber = +this.numberText;
        this.numberText = "0";
        this.operator = num;
      }
    }else {
      if (this.numberText == "0") {
        this.numberText = num;
      }else {
        this.numberText = this.numberText + num;
      }
    }
  }

  calculateNumber(n1 :number, n2 :number, opert : string) : number | null {
    const result : {[key : string]: (a : number, b : number) => number  } = {
      '+' : (a, b) => a + b,
      '-' : (a, b) => a - b,
      '*' : (a, b) => a * b,
      '/' : (a, b) => a / b
    };

    if(result.hasOwnProperty(opert)) {
      return result[opert](n1, n2);
    }else {
      alert("Operateur non supporté : ${opert}");
      return null;
    }
  }

}
