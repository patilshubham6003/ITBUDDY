import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceFilledSummaryReportComponent } from './preference-filled-summary-report.component';

describe('PreferenceFilledSummaryReportComponent', () => {
  let component: PreferenceFilledSummaryReportComponent;
  let fixture: ComponentFixture<PreferenceFilledSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferenceFilledSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceFilledSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
