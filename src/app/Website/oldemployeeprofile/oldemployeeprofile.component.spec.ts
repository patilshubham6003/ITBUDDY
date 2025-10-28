import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldemployeeprofileComponent } from './oldemployeeprofile.component';

describe('OldemployeeprofileComponent', () => {
  let component: OldemployeeprofileComponent;
  let fixture: ComponentFixture<OldemployeeprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldemployeeprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldemployeeprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
