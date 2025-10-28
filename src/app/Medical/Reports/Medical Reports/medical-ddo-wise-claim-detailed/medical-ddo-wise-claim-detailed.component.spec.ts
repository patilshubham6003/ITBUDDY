import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDdoWiseClaimDetailedComponent } from './medical-ddo-wise-claim-detailed.component';

describe('MedicalDdoWiseClaimDetailedComponent', () => {
  let component: MedicalDdoWiseClaimDetailedComponent;
  let fixture: ComponentFixture<MedicalDdoWiseClaimDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalDdoWiseClaimDetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalDdoWiseClaimDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
