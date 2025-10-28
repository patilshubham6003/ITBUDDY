import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTravelConcessionBillComponent } from './leave-travel-concession-bill.component';

describe('LeaveTravelConcessionBillComponent', () => {
  let component: LeaveTravelConcessionBillComponent;
  let fixture: ComponentFixture<LeaveTravelConcessionBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveTravelConcessionBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveTravelConcessionBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
