import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorWiseAmountStatsReportComponent } from './inspector-wise-amount-stats-report.component';

describe('InspectorWiseAmountStatsReportComponent', () => {
  let component: InspectorWiseAmountStatsReportComponent;
  let fixture: ComponentFixture<InspectorWiseAmountStatsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectorWiseAmountStatsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorWiseAmountStatsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
