import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRetirementReportComponent } from './employee-retirement-report.component';

describe('EmployeeRetirementReportComponent', () => {
  let component: EmployeeRetirementReportComponent;
  let fixture: ComponentFixture<EmployeeRetirementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeRetirementReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeRetirementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
