import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDdoWiseClaimDetailedComponent } from './transfer-ddo-wise-claim-detailed.component';

describe('TransferDdoWiseClaimDetailedComponent', () => {
  let component: TransferDdoWiseClaimDetailedComponent;
  let fixture: ComponentFixture<TransferDdoWiseClaimDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferDdoWiseClaimDetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferDdoWiseClaimDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
