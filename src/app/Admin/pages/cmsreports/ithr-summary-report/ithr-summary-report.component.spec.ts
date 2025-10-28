import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IthrSummaryReportComponent } from './ithr-summary-report.component';

describe('IthrSummaryReportComponent', () => {
  let component: IthrSummaryReportComponent;
  let fixture: ComponentFixture<IthrSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IthrSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IthrSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
