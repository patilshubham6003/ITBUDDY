import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefhodpermissionComponent } from './refhodpermission.component';

describe('RefhodpermissionComponent', () => {
  let component: RefhodpermissionComponent;
  let fixture: ComponentFixture<RefhodpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefhodpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefhodpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
