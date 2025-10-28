import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseAmountStatsComponent } from './employee-wise-amount-stats.component';

describe('EmployeeWiseAmountStatsComponent', () => {
  let component: EmployeeWiseAmountStatsComponent;
  let fixture: ComponentFixture<EmployeeWiseAmountStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseAmountStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseAmountStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
