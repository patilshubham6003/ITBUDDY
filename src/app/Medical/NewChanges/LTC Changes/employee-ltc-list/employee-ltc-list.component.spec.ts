import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLtcListComponent } from './employee-ltc-list.component';

describe('EmployeeLtcListComponent', () => {
  let component: EmployeeLtcListComponent;
  let fixture: ComponentFixture<EmployeeLtcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLtcListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLtcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
