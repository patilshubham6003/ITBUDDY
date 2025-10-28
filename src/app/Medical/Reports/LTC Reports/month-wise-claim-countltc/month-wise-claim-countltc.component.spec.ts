import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseClaimCountltcComponent } from './month-wise-claim-countltc.component';

describe('MonthWiseClaimCountltcComponent', () => {
  let component: MonthWiseClaimCountltcComponent;
  let fixture: ComponentFixture<MonthWiseClaimCountltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthWiseClaimCountltcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseClaimCountltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
