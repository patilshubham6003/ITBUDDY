import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorWiseLtcSummaryReportComponent } from './inspector-wise-ltc-summary-report.component';

describe('InspectorWiseLtcSummaryReportComponent', () => {
  let component: InspectorWiseLtcSummaryReportComponent;
  let fixture: ComponentFixture<InspectorWiseLtcSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorWiseLtcSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorWiseLtcSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
