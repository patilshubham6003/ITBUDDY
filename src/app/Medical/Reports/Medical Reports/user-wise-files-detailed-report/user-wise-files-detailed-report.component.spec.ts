import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseFilesDetailedReportComponent } from './user-wise-files-detailed-report.component';

describe('UserWiseFilesDetailedReportComponent', () => {
  let component: UserWiseFilesDetailedReportComponent;
  let fixture: ComponentFixture<UserWiseFilesDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseFilesDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseFilesDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
