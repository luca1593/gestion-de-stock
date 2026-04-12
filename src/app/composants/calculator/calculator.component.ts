import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { BoutonCalc } from './bouton.calc';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit, OnDestroy {

  @ViewChild('calculatorContainer') calculatorContainer!: ElementRef;

  firstNumber: number = 0;
  secondNumber: number = 0;
  numberText: string = '0';
  ops: string[] = ['+', '-', '*', '/'];
  operator: string = '';

  get hasFocus(): boolean {
    const active = document.activeElement;
    if (!active) return false;
    const container = this.calculatorContainer?.nativeElement;
    if (!container) return false;
    return container.contains(active) || container === active;
  }

  public boutonCalcs: Array<BoutonCalc> = [
    { txt: 'AC', id: 'ac' },
    { txt: '⌫', id: 'c' },
    { txt: '7', id: '7' },
    { txt: '8', id: '8' },
    { txt: '9', id: '9' },
    { txt: '×', id: '*' },
    { txt: '4', id: '4' },
    { txt: '5', id: '5' },
    { txt: '6', id: '6' },
    { txt: '−', id: '-' },
    { txt: '1', id: '1' },
    { txt: '2', id: '2' },
    { txt: '3', id: '3' },
    { txt: '+', id: '+' },
    { txt: '.', id: '.' },
    { txt: '0', id: '0' },
    { txt: '=', id: '=' },
    { txt: '÷', id: '/' }
  ];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.hasFocus) return;
    
    event.preventDefault();
    const key = event.key;
    
    if ((key >= '0' && key <= '9') || key === '.') {
      this.typeNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      this.typeNumber(key);
    } else if (key === 'Enter' || key === '=') {
      this.typeNumber('=');
    } else if (key === 'Backspace') {
      this.typeNumber('c');
    } else if (key === 'Escape') {
      this.typeNumber('ac');
    }
  }

  typeNumber(txt: string): void {
    if (txt === '=') {
      this.secondNumber = parseFloat(this.numberText);
      const result = this.calculateNumber(this.firstNumber, this.secondNumber, this.operator);
      this.numberText = result !== null ? String(result) : '0';
      this.firstNumber = 0;
      this.secondNumber = 0;
      this.operator = '';
    } else if (this.ops.includes(txt)) {
      if (this.firstNumber === 0 && this.numberText !== '0') {
        this.firstNumber = parseFloat(this.numberText);
        this.numberText = '0';
        this.operator = txt;
      } else if (this.firstNumber !== 0 && this.operator) {
        this.secondNumber = parseFloat(this.numberText);
        const result = this.calculateNumber(this.firstNumber, this.secondNumber, this.operator);
        this.firstNumber = result !== null ? result : 0;
        this.numberText = '0';
        this.operator = txt;
      }
    } else if (txt === '.') {
      if (!this.numberText.includes('.')) {
        this.numberText = this.numberText + '.';
      }
    } else if (txt === 'c') {
      if (this.numberText.length === 1 || this.numberText === '0') {
        this.numberText = '0';
      } else {
        this.numberText = this.numberText.slice(0, -1);
      }
    } else if (txt === 'ac') {
      this.numberText = '0';
      this.firstNumber = 0;
      this.secondNumber = 0;
      this.operator = '';
    } else {
      if (this.numberText === '0') {
        this.numberText = txt;
      } else {
        this.numberText = this.numberText + txt;
      }
    }
  }

  calculateNumber(n1: number, n2: number, opert: string): number | null {
    const result: { [key: string]: (a: number, b: number) => number } = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => b !== 0 ? a / b : 0
    };

    if (result[opert]) {
      return result[opert](n1, n2);
    }
    return null;
  }
}