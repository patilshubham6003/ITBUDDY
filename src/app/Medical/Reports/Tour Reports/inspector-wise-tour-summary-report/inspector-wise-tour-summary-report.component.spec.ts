import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorWiseTourSummaryReportComponent } from './inspector-wise-tour-summary-report.component';

describe('InspectorWiseTourSummaryReportComponent', () => {
  let component: InspectorWiseTourSummaryReportComponent;
  let fixture: ComponentFixture<InspectorWiseTourSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorWiseTourSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorWiseTourSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
