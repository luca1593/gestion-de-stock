import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementFactureComponent } from './paiement-facture.component';

describe('PaiementFactureComponent', () => {
  let component: PaiementFactureComponent;
  let fixture: ComponentFixture<PaiementFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementFactureComponent ]
    })
    .compileComponents();

    fixture=TestBed.createComponent(PaiementFactureComponent);
    component=fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});