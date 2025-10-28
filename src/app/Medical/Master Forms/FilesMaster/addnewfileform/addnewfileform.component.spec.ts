import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewfileformComponent } from './addnewfileform.component';

describe('AddnewfileformComponent', () => {
  let component: AddnewfileformComponent;
  let fixture: ComponentFixture<AddnewfileformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewfileformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewfileformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
