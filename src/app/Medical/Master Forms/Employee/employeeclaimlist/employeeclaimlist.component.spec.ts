import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeclaimlistComponent } from './employeeclaimlist.component';

describe('EmployeeclaimlistComponent', () => {
  let component: EmployeeclaimlistComponent;
  let fixture: ComponentFixture<EmployeeclaimlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeclaimlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeclaimlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
