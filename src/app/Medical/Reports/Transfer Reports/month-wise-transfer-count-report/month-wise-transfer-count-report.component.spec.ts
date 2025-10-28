import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseTransferCountReportComponent } from './month-wise-transfer-count-report.component';

describe('MonthWiseTransferCountReportComponent', () => {
  let component: MonthWiseTransferCountReportComponent;
  let fixture: ComponentFixture<MonthWiseTransferCountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthWiseTransferCountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseTransferCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
