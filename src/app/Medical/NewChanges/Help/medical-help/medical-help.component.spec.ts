import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalHelpComponent } from './medical-help.component';

describe('MedicalHelpComponent', () => {
  let component: MedicalHelpComponent;
  let fixture: ComponentFixture<MedicalHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
