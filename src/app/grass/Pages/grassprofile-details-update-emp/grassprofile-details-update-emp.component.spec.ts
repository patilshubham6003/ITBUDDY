import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassprofileDetailsUpdateEmpComponent } from './grassprofile-details-update-emp.component';

describe('GrassprofileDetailsUpdateEmpComponent', () => {
  let component: GrassprofileDetailsUpdateEmpComponent;
  let fixture: ComponentFixture<GrassprofileDetailsUpdateEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrassprofileDetailsUpdateEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrassprofileDetailsUpdateEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
