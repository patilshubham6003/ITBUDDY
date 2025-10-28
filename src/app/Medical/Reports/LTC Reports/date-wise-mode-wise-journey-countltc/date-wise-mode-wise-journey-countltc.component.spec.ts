import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateWiseModeWiseJourneyCountltcComponent } from './date-wise-mode-wise-journey-countltc.component';

describe('DateWiseModeWiseJourneyCountltcComponent', () => {
  let component: DateWiseModeWiseJourneyCountltcComponent;
  let fixture: ComponentFixture<DateWiseModeWiseJourneyCountltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateWiseModeWiseJourneyCountltcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateWiseModeWiseJourneyCountltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
