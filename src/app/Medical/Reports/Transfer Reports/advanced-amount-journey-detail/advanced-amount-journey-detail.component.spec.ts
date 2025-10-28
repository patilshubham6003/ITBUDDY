import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedAmountJourneyDetailComponent } from './advanced-amount-journey-detail.component';

describe('AdvancedAmountJourneyDetailComponent', () => {
  let component: AdvancedAmountJourneyDetailComponent;
  let fixture: ComponentFixture<AdvancedAmountJourneyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedAmountJourneyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedAmountJourneyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
