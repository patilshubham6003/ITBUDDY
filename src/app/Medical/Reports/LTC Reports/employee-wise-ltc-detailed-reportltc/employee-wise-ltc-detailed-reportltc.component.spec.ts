import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseLtcDetailedReportltcComponent } from './employee-wise-ltc-detailed-reportltc.component';

describe('EmployeeWiseLtcDetailedReportltcComponent', () => {
  let component: EmployeeWiseLtcDetailedReportltcComponent;
  let fixture: ComponentFixture<EmployeeWiseLtcDetailedReportltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseLtcDetailedReportltcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseLtcDetailedReportltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
