import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HODPermissionlistComponent } from './hodpermissionlist.component';

describe('HODPermissionlistComponent', () => {
  let component: HODPermissionlistComponent;
  let fixture: ComponentFixture<HODPermissionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HODPermissionlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HODPermissionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
