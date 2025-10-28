import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationDrawerComponent } from './calculation-drawer.component';

describe('CalculationDrawerComponent', () => {
  let component: CalculationDrawerComponent;
  let fixture: ComponentFixture<CalculationDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculationDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
