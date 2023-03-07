import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelCmdCltFrsComponent } from './nouvel-cmd-clt-frs.component';

describe('NouvelCmdCltFrsComponent', () => {
  let component: NouvelCmdCltFrsComponent;
  let fixture: ComponentFixture<NouvelCmdCltFrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelCmdCltFrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelCmdCltFrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
