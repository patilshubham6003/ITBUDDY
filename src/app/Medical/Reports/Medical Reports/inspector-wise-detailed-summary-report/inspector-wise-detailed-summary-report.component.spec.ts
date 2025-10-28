import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorWiseDetailedSummaryReportComponent } from './inspector-wise-detailed-summary-report.component';

describe('InspectorWiseDetailedSummaryReportComponent', () => {
  let component: InspectorWiseDetailedSummaryReportComponent;
  let fixture: ComponentFixture<InspectorWiseDetailedSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorWiseDetailedSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorWiseDetailedSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
