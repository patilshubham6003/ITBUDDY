import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPendingClaimComponent } from './transfer-pending-claim.component';

describe('TransferPendingClaimComponent', () => {
  let component: TransferPendingClaimComponent;
  let fixture: ComponentFixture<TransferPendingClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferPendingClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPendingClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
