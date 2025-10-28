import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ltcsheet2Component } from './ltcsheet2.component';

describe('Ltcsheet2Component', () => {
  let component: Ltcsheet2Component;
  let fixture: ComponentFixture<Ltcsheet2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ltcsheet2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ltcsheet2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
