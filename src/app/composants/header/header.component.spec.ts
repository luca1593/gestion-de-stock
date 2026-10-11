import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HeaderComponent } from './header.component';

@Component({ selector: 'app-breadcrumb', template: '' })
class BreadcrumbStubComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent, BreadcrumbStubComponent ]
    })
    .compileComponents();

    fixture=TestBed.createComponent(HeaderComponent);
    component=fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
