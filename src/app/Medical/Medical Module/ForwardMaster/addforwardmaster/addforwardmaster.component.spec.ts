import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddforwardmasterComponent } from './addforwardmaster.component';

describe('AddforwardmasterComponent', () => {
  let component: AddforwardmasterComponent;
  let fixture: ComponentFixture<AddforwardmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddforwardmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddforwardmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
