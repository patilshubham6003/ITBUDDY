import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratesenioritylisttableComponent } from './generatesenioritylisttable.component';

describe('GeneratesenioritylisttableComponent', () => {
  let component: GeneratesenioritylisttableComponent;
  let fixture: ComponentFixture<GeneratesenioritylisttableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratesenioritylisttableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratesenioritylisttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
