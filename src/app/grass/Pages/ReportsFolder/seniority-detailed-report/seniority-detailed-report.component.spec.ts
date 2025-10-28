import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorityDetailedReportComponent } from './seniority-detailed-report.component';

describe('SeniorityDetailedReportComponent', () => {
  let component: SeniorityDetailedReportComponent;
  let fixture: ComponentFixture<SeniorityDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeniorityDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeniorityDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
