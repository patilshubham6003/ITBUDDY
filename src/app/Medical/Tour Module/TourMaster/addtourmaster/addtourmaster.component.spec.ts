import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtourmasterComponent } from './addtourmaster.component';

describe('AddtourmasterComponent', () => {
  let component: AddtourmasterComponent;
  let fixture: ComponentFixture<AddtourmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtourmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtourmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
