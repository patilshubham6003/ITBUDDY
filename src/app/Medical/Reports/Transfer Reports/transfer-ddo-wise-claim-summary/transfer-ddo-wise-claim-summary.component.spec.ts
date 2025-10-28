import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDdoWiseClaimSummaryComponent } from './transfer-ddo-wise-claim-summary.component';

describe('TransferDdoWiseClaimSummaryComponent', () => {
  let component: TransferDdoWiseClaimSummaryComponent;
  let fixture: ComponentFixture<TransferDdoWiseClaimSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferDdoWiseClaimSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferDdoWiseClaimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
