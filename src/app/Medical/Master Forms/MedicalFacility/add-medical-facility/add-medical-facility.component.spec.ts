import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalFacilityComponent } from './add-medical-facility.component';

describe('AddMedicalFacilityComponent', () => {
  let component: AddMedicalFacilityComponent;
  let fixture: ComponentFixture<AddMedicalFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMedicalFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicalFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
