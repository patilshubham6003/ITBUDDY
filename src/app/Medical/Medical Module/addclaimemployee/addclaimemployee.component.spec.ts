import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclaimemployeeComponent } from './addclaimemployee.component';

describe('AddclaimemployeeComponent', () => {
  let component: AddclaimemployeeComponent;
  let fixture: ComponentFixture<AddclaimemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddclaimemployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclaimemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
