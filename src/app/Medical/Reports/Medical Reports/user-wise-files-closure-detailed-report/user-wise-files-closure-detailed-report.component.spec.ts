import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseFilesClosureDetailedReportComponent } from './user-wise-files-closure-detailed-report.component';

describe('UserWiseFilesClosureDetailedReportComponent', () => {
  let component: UserWiseFilesClosureDetailedReportComponent;
  let fixture: ComponentFixture<UserWiseFilesClosureDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseFilesClosureDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseFilesClosureDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
