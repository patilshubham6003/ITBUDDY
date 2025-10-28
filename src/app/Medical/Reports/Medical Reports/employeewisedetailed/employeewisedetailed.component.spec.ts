import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeewisedetailedComponent } from './employeewisedetailed.component';

describe('EmployeewisedetailedComponent', () => {
  let component: EmployeewisedetailedComponent;
  let fixture: ComponentFixture<EmployeewisedetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeewisedetailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeewisedetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
