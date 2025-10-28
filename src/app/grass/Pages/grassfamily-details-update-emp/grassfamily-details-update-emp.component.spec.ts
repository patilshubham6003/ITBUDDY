import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassfamilyDetailsUpdateEmpComponent } from './grassfamily-details-update-emp.component';

describe('GrassfamilyDetailsUpdateEmpComponent', () => {
  let component: GrassfamilyDetailsUpdateEmpComponent;
  let fixture: ComponentFixture<GrassfamilyDetailsUpdateEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrassfamilyDetailsUpdateEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrassfamilyDetailsUpdateEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
