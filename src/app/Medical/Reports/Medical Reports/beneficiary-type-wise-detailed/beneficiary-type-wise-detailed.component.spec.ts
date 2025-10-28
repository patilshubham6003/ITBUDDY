import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTypeWiseDetailedComponent } from './beneficiary-type-wise-detailed.component';

describe('BeneficiaryTypeWiseDetailedComponent', () => {
  let component: BeneficiaryTypeWiseDetailedComponent;
  let fixture: ComponentFixture<BeneficiaryTypeWiseDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryTypeWiseDetailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryTypeWiseDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
