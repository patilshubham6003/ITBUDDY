import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageWiseSummaryReportComponent } from './stage-wise-summary-report.component';

describe('StageWiseSummaryReportComponent', () => {
  let component: StageWiseSummaryReportComponent;
  let fixture: ComponentFixture<StageWiseSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageWiseSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageWiseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
