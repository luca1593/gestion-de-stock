import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-laoder',
  templateUrl: './laoder.component.html',
  styleUrls: ['./laoder.component.css']
})
export class LaoderComponent implements OnInit, OnDestroy {

  loading$: Observable<boolean>;
  loadingMessage$: Observable<string>;
  progress$: Observable<number>;

  constructor(
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;
    this.loadingMessage$ = this.loadingService.loadingMessage$;
    this.progress$ = this.loadingService.progress$;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

}