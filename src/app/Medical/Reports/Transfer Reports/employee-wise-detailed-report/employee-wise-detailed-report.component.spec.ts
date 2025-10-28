import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseDetailedReportComponent } from './employee-wise-detailed-report.component';

describe('EmployeeWiseDetailedReportComponent', () => {
  let component: EmployeeWiseDetailedReportComponent;
  let fixture: ComponentFixture<EmployeeWiseDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
