import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDdoWiseClaimSummaryComponent } from './medical-ddo-wise-claim-summary.component';

describe('MedicalDdoWiseClaimSummaryComponent', () => {
  let component: MedicalDdoWiseClaimSummaryComponent;
  let fixture: ComponentFixture<MedicalDdoWiseClaimSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalDdoWiseClaimSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalDdoWiseClaimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
