import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalChangesComponent } from './medical-changes.component';

describe('MedicalChangesComponent', () => {
  let component: MedicalChangesComponent;
  let fixture: ComponentFixture<MedicalChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalChangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
