import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeatailClientFournisseurComponent } from './deatail-client-fournisseur.component';

describe('DeatailClientFournisseurComponent', () => {
  let component: DeatailClientFournisseurComponent;
  let fixture: ComponentFixture<DeatailClientFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeatailClientFournisseurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeatailClientFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
