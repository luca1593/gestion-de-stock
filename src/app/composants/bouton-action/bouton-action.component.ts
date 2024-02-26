import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bouton-action',
  templateUrl: './bouton-action.component.html',
  styleUrls: ['./bouton-action.component.css']
})
export class BoutonActionComponent implements OnInit {

  @Input()
  isNouveauVisible = true;
  @Input()
  isImporterVisible = true;
  @Input()
  isExporterVisible = true;

  @Output()
  clickEvent = new EventEmitter();

  @Output()
  clickExportEvent = new EventEmitter();

  @Output()
  clickImportEvent = new EventEmitter();

  constructor() {
    // Not implemented
   }

  ngOnInit(): void {
    // Not implemented
  }

  boutonNouveauClick (): void{
    this.clickEvent.emit();
  }

  boutonImportClick(): void {
    this.clickImportEvent.emit();
  }

  boutonExportClick(): void {
    this.clickExportEvent.emit();
  }

}
