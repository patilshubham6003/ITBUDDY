import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeltclistComponent } from './employeeltclist.component';

describe('EmployeeltclistComponent', () => {
  let component: EmployeeltclistComponent;
  let fixture: ComponentFixture<EmployeeltclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeltclistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeltclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
