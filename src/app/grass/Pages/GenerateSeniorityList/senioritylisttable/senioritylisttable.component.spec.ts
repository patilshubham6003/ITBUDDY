import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenioritylisttableComponent } from './senioritylisttable.component';

describe('SenioritylisttableComponent', () => {
  let component: SenioritylisttableComponent;
  let fixture: ComponentFixture<SenioritylisttableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenioritylisttableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenioritylisttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
