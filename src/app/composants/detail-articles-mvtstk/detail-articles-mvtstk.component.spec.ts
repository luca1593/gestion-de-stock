import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticlesMvtstkComponent } from './detail-articles-mvtstk.component';

describe('DetailArticlesMvtstkComponent', () => {
  let component: DetailArticlesMvtstkComponent;
  let fixture: ComponentFixture<DetailArticlesMvtstkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailArticlesMvtstkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailArticlesMvtstkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
