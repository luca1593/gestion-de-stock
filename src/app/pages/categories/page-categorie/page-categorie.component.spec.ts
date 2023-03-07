import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCategorieComponent } from './page-categorie.component';

describe('PageCategorieComponent', () => {
  let component: PageCategorieComponent;
  let fixture: ComponentFixture<PageCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCategorieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
