import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayWiseFilesSummaryReportComponent } from './day-wise-files-summary-report.component';

describe('DayWiseFilesSummaryReportComponent', () => {
  let component: DayWiseFilesSummaryReportComponent;
  let fixture: ComponentFixture<DayWiseFilesSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayWiseFilesSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayWiseFilesSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
