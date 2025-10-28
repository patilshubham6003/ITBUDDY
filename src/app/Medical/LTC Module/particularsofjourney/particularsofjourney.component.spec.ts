import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularsofjourneyComponent } from './particularsofjourney.component';

describe('ParticularsofjourneyComponent', () => {
  let component: ParticularsofjourneyComponent;
  let fixture: ComponentFixture<ParticularsofjourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticularsofjourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticularsofjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
