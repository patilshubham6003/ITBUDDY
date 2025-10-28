import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyparticularcityComponent } from './journeyparticularcity.component';

describe('JourneyparticularcityComponent', () => {
  let component: JourneyparticularcityComponent;
  let fixture: ComponentFixture<JourneyparticularcityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyparticularcityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyparticularcityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
