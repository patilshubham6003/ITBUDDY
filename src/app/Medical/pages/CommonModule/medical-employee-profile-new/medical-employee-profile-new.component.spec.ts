import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalEmployeeProfileNewComponent } from './medical-employee-profile-new.component';

describe('MedicalEmployeeProfileNewComponent', () => {
  let component: MedicalEmployeeProfileNewComponent;
  let fixture: ComponentFixture<MedicalEmployeeProfileNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalEmployeeProfileNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalEmployeeProfileNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
