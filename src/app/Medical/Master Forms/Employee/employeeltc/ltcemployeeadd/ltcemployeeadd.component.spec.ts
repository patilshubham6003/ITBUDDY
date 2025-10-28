import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcemployeeaddComponent } from './ltcemployeeadd.component';

describe('LtcemployeeaddComponent', () => {
  let component: LtcemployeeaddComponent;
  let fixture: ComponentFixture<LtcemployeeaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcemployeeaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcemployeeaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
