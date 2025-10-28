import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyWiseFilesSummaryReportComponent } from './hierarchy-wise-files-summary-report.component';

describe('HierarchyWiseFilesSummaryReportComponent', () => {
  let component: HierarchyWiseFilesSummaryReportComponent;
  let fixture: ComponentFixture<HierarchyWiseFilesSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyWiseFilesSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyWiseFilesSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
