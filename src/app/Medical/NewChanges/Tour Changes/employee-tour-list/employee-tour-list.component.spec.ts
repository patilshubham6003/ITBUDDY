import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTourListComponent } from './employee-tour-list.component';

describe('EmployeeTourListComponent', () => {
  let component: EmployeeTourListComponent;
  let fixture: ComponentFixture<EmployeeTourListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTourListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
