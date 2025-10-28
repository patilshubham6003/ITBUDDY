import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenioritylistusersComponent } from './senioritylistusers.component';

describe('SenioritylistusersComponent', () => {
  let component: SenioritylistusersComponent;
  let fixture: ComponentFixture<SenioritylistusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenioritylistusersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenioritylistusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
