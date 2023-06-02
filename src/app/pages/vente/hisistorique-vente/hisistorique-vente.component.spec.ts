import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HisistoriqueVenteComponent } from './hisistorique-vente.component';

describe('HisistoriqueVenteComponent', () => {
  let component: HisistoriqueVenteComponent;
  let fixture: ComponentFixture<HisistoriqueVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HisistoriqueVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HisistoriqueVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
