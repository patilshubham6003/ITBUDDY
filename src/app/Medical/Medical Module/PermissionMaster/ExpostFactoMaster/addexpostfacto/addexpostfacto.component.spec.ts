import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexpostfactoComponent } from './addexpostfacto.component';

describe('AddexpostfactoComponent', () => {
  let component: AddexpostfactoComponent;
  let fixture: ComponentFixture<AddexpostfactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddexpostfactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddexpostfactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
