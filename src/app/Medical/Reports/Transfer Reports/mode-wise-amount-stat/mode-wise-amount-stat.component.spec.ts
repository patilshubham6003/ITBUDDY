import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeWiseAmountStatComponent } from './mode-wise-amount-stat.component';

describe('ModeWiseAmountStatComponent', () => {
  let component: ModeWiseAmountStatComponent;
  let fixture: ComponentFixture<ModeWiseAmountStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeWiseAmountStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeWiseAmountStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
