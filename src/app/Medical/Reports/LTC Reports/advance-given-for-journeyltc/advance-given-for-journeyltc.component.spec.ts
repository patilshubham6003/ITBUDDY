import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceGivenForJourneyltcComponent } from './advance-given-for-journeyltc.component';

describe('AdvanceGivenForJourneyltcComponent', () => {
  let component: AdvanceGivenForJourneyltcComponent;
  let fixture: ComponentFixture<AdvanceGivenForJourneyltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceGivenForJourneyltcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceGivenForJourneyltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
