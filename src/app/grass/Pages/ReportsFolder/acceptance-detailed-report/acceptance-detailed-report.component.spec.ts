import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceDetailedReportComponent } from './acceptance-detailed-report.component';

describe('AcceptanceDetailedReportComponent', () => {
  let component: AcceptanceDetailedReportComponent;
  let fixture: ComponentFixture<AcceptanceDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
