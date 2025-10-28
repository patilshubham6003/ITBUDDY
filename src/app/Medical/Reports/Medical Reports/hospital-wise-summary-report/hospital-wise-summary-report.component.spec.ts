import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalWiseSummaryReportComponent } from './hospital-wise-summary-report.component';

describe('HospitalWiseSummaryReportComponent', () => {
  let component: HospitalWiseSummaryReportComponent;
  let fixture: ComponentFixture<HospitalWiseSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalWiseSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalWiseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
