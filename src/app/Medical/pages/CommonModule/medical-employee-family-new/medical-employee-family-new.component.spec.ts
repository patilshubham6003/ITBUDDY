import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalEmployeeFamilyNewComponent } from './medical-employee-family-new.component';

describe('MedicalEmployeeFamilyNewComponent', () => {
  let component: MedicalEmployeeFamilyNewComponent;
  let fixture: ComponentFixture<MedicalEmployeeFamilyNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalEmployeeFamilyNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalEmployeeFamilyNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
