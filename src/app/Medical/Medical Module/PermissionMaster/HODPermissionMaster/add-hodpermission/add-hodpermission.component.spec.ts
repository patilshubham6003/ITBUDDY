import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHODPermissionComponent } from './add-hodpermission.component';

describe('AddHODPermissionComponent', () => {
  let component: AddHODPermissionComponent;
  let fixture: ComponentFixture<AddHODPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHODPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHODPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
