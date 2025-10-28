import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdoWiseSignatureDetailedReportComponent } from './ddo-wise-signature-detailed-report.component';

describe('DdoWiseSignatureDetailedReportComponent', () => {
  let component: DdoWiseSignatureDetailedReportComponent;
  let fixture: ComponentFixture<DdoWiseSignatureDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdoWiseSignatureDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdoWiseSignatureDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
