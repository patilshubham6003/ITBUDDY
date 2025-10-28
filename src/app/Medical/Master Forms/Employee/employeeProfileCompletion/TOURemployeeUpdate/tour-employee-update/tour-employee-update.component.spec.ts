import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourEmployeeUpdateComponent } from './tour-employee-update.component';

describe('TourEmployeeUpdateComponent', () => {
  let component: TourEmployeeUpdateComponent;
  let fixture: ComponentFixture<TourEmployeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourEmployeeUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourEmployeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
