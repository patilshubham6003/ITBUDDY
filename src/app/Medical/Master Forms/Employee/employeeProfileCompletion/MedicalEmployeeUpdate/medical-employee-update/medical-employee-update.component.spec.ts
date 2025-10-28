import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalEmployeeUpdateComponent } from './medical-employee-update.component';

describe('MedicalEmployeeUpdateComponent', () => {
  let component: MedicalEmployeeUpdateComponent;
  let fixture: ComponentFixture<MedicalEmployeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalEmployeeUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalEmployeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
