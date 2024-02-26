import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVenteComponent } from './page-vente.component';

describe('PageVenteComponent', () => {
  let component: PageVenteComponent;
  let fixture: ComponentFixture<PageVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
