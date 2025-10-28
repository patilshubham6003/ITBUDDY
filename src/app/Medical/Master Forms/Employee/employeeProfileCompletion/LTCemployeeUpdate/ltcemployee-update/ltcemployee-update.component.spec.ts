import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LTCemployeeUpdateComponent } from './ltcemployee-update.component';

describe('LTCemployeeUpdateComponent', () => {
  let component: LTCemployeeUpdateComponent;
  let fixture: ComponentFixture<LTCemployeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LTCemployeeUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LTCemployeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
