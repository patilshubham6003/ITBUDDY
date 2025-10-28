import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HispitalWiseAmountStatsComponent } from './hispital-wise-amount-stats.component';

describe('HispitalWiseAmountStatsComponent', () => {
  let component: HispitalWiseAmountStatsComponent;
  let fixture: ComponentFixture<HispitalWiseAmountStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HispitalWiseAmountStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HispitalWiseAmountStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
