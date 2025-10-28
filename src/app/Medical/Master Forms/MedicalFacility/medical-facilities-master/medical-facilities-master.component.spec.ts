import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilitiesMasterComponent } from './medical-facilities-master.component';

describe('MedicalFacilitiesMasterComponent', () => {
  let component: MedicalFacilitiesMasterComponent;
  let fixture: ComponentFixture<MedicalFacilitiesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalFacilitiesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalFacilitiesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
