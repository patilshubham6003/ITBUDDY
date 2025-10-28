import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorWiseTransferSummaryReportComponent } from './inspector-wise-transfer-summary-report.component';

describe('InspectorWiseTransferSummaryReportComponent', () => {
  let component: InspectorWiseTransferSummaryReportComponent;
  let fixture: ComponentFixture<InspectorWiseTransferSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorWiseTransferSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorWiseTransferSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
