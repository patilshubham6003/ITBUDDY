import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddareaComponent } from './addarea.component';

describe('AddareaComponent', () => {
  let component: AddareaComponent;
  let fixture: ComponentFixture<AddareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
