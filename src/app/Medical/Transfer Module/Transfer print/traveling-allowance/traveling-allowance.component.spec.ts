import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingAllowanceComponent } from './traveling-allowance.component';

describe('TravelingAllowanceComponent', () => {
  let component: TravelingAllowanceComponent;
  let fixture: ComponentFixture<TravelingAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelingAllowanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelingAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
