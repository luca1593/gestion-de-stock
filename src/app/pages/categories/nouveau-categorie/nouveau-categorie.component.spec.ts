import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauCategorieComponent } from './nouveau-categorie.component';

describe('NouveauCategorieComponent', () => {
  let component: NouveauCategorieComponent;
  let fixture: ComponentFixture<NouveauCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauCategorieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
