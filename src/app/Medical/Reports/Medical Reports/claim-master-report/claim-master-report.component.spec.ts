import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimMasterReportComponent } from './claim-master-report.component';

describe('ClaimMasterReportComponent', () => {
  let component: ClaimMasterReportComponent;
  let fixture: ComponentFixture<ClaimMasterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimMasterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimMasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
