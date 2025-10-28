import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyparticulartoursComponent } from './journeyparticulartours.component';

describe('JourneyparticulartoursComponent', () => {
  let component: JourneyparticulartoursComponent;
  let fixture: ComponentFixture<JourneyparticulartoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyparticulartoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyparticulartoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
