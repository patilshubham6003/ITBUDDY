import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentDetailedReportComponent } from './allotment-detailed-report.component';

describe('AllotmentDetailedReportComponent', () => {
  let component: AllotmentDetailedReportComponent;
  let fixture: ComponentFixture<AllotmentDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
