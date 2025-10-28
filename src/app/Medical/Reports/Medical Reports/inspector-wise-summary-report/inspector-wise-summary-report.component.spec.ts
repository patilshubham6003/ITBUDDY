import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorWiseSummaryReportComponent } from './inspector-wise-summary-report.component';

describe('InspectorWiseSummaryReportComponent', () => {
  let component: InspectorWiseSummaryReportComponent;
  let fixture: ComponentFixture<InspectorWiseSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorWiseSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorWiseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
