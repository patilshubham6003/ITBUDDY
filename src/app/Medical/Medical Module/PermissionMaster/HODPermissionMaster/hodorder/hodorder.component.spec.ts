import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodorderComponent } from './hodorder.component';

describe('HodorderComponent', () => {
  let component: HodorderComponent;
  let fixture: ComponentFixture<HodorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HodorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HodorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
