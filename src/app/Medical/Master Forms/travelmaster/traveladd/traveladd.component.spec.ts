import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraveladdComponent } from './traveladd.component';

describe('TraveladdComponent', () => {
  let component: TraveladdComponent;
  let fixture: ComponentFixture<TraveladdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraveladdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraveladdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
