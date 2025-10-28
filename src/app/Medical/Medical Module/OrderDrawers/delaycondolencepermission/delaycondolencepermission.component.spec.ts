import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaycondolencepermissionComponent } from './delaycondolencepermission.component';

describe('DelaycondolencepermissionComponent', () => {
  let component: DelaycondolencepermissionComponent;
  let fixture: ComponentFixture<DelaycondolencepermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelaycondolencepermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelaycondolencepermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
