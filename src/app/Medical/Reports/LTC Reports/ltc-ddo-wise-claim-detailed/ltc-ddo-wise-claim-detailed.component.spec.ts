import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcDdoWiseClaimDetailedComponent } from './ltc-ddo-wise-claim-detailed.component';

describe('LtcDdoWiseClaimDetailedComponent', () => {
  let component: LtcDdoWiseClaimDetailedComponent;
  let fixture: ComponentFixture<LtcDdoWiseClaimDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcDdoWiseClaimDetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LtcDdoWiseClaimDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
