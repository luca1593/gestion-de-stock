import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDashbordComponent } from './page-dashbord.component';

describe('PageDashbordComponent', () => {
  let component: PageDashbordComponent;
  let fixture: ComponentFixture<PageDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDashbordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
