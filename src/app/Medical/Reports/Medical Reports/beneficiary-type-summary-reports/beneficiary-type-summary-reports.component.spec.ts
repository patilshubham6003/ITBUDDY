import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTypeSummaryReportsComponent } from './beneficiary-type-summary-reports.component';

describe('BeneficiaryTypeSummaryReportsComponent', () => {
  let component: BeneficiaryTypeSummaryReportsComponent;
  let fixture: ComponentFixture<BeneficiaryTypeSummaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryTypeSummaryReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryTypeSummaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
