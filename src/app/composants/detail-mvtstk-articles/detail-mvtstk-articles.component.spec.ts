import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMvtstkArticlesComponent } from './detail-mvtstk-articles.component';

describe('DetailMvtstkArticlesComponent', () => {
  let component: DetailMvtstkArticlesComponent;
  let fixture: ComponentFixture<DetailMvtstkArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMvtstkArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMvtstkArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
