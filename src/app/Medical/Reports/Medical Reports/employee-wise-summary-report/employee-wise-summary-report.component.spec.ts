import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseSummaryReportComponent } from './employee-wise-summary-report.component';

describe('EmployeeWiseSummaryReportComponent', () => {
  let component: EmployeeWiseSummaryReportComponent;
  let fixture: ComponentFixture<EmployeeWiseSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
