import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseFilesSummaryReportComponent } from './user-wise-files-summary-report.component';

describe('UserWiseFilesSummaryReportComponent', () => {
  let component: UserWiseFilesSummaryReportComponent;
  let fixture: ComponentFixture<UserWiseFilesSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseFilesSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseFilesSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
