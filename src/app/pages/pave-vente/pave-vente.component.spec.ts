import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaveVenteComponent } from './pave-vente.component';

describe('PaveVenteComponent', () => {
  let component: PaveVenteComponent;
  let fixture: ComponentFixture<PaveVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaveVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaveVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
