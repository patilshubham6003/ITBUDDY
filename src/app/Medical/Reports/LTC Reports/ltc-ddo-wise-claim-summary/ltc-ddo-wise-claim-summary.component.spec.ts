import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcDdoWiseClaimSummaryComponent } from './ltc-ddo-wise-claim-summary.component';

describe('LtcDdoWiseClaimSummaryComponent', () => {
  let component: LtcDdoWiseClaimSummaryComponent;
  let fixture: ComponentFixture<LtcDdoWiseClaimSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcDdoWiseClaimSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LtcDdoWiseClaimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
