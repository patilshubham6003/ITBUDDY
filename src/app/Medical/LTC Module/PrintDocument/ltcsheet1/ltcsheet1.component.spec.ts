import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ltcsheet1Component } from './ltcsheet1.component';

describe('Ltcsheet1Component', () => {
  let component: Ltcsheet1Component;
  let fixture: ComponentFixture<Ltcsheet1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ltcsheet1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ltcsheet1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
