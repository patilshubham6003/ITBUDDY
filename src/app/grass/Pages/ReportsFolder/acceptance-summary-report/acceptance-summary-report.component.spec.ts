import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceSummaryReportComponent } from './acceptance-summary-report.component';

describe('AcceptanceSummaryReportComponent', () => {
  let component: AcceptanceSummaryReportComponent;
  let fixture: ComponentFixture<AcceptanceSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
