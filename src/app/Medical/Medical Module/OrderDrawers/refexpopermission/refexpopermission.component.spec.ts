import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefexpopermissionComponent } from './refexpopermission.component';

describe('RefexpopermissionComponent', () => {
  let component: RefexpopermissionComponent;
  let fixture: ComponentFixture<RefexpopermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefexpopermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefexpopermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
