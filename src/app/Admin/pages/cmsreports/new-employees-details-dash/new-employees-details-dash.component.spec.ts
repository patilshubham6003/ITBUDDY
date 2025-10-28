import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeesDetailsDashComponent } from './new-employees-details-dash.component';

describe('NewEmployeesDetailsDashComponent', () => {
  let component: NewEmployeesDetailsDashComponent;
  let fixture: ComponentFixture<NewEmployeesDetailsDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEmployeesDetailsDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEmployeesDetailsDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
