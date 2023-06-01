import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { laoderState } from '../laoder.model';

@Injectable({
  providedIn: 'root'
})
export class LaoderService {

  private laoderSubject= new Subject<laoderState>();

  laoderState = this.laoderSubject.asObservable();

  constructor() { }

  show(): void{
    this.laoderSubject.next({ show: true });
  }

  hide(): void{
    this.laoderSubject.next({ show: false });
  }

}
