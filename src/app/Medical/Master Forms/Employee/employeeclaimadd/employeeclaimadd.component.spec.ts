import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeclaimaddComponent } from './employeeclaimadd.component';

describe('EmployeeclaimaddComponent', () => {
  let component: EmployeeclaimaddComponent;
  let fixture: ComponentFixture<EmployeeclaimaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeclaimaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeclaimaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
