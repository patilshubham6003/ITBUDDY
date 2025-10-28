import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellingallouncebillComponent } from './travellingallouncebill.component';

describe('TravellingallouncebillComponent', () => {
  let component: TravellingallouncebillComponent;
  let fixture: ComponentFixture<TravellingallouncebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravellingallouncebillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellingallouncebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
