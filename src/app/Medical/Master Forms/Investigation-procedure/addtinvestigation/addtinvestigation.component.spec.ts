import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtinvestigationComponent } from './addtinvestigation.component';

describe('AddtinvestigationComponent', () => {
  let component: AddtinvestigationComponent;
  let fixture: ComponentFixture<AddtinvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtinvestigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtinvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
