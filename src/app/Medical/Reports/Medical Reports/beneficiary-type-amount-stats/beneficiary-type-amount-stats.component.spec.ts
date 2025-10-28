import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTypeAmountStatsComponent } from './beneficiary-type-amount-stats.component';

describe('BeneficiaryTypeAmountStatsComponent', () => {
  let component: BeneficiaryTypeAmountStatsComponent;
  let fixture: ComponentFixture<BeneficiaryTypeAmountStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryTypeAmountStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryTypeAmountStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
