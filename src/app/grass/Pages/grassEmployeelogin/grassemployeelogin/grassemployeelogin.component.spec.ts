import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassemployeeloginComponent } from './grassemployeelogin.component';

describe('GrassemployeeloginComponent', () => {
  let component: GrassemployeeloginComponent;
  let fixture: ComponentFixture<GrassemployeeloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrassemployeeloginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrassemployeeloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
