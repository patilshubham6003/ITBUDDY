import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgenerateexpostfactoComponent } from './addgenerateexpostfacto.component';

describe('AddgenerateexpostfactoComponent', () => {
  let component: AddgenerateexpostfactoComponent;
  let fixture: ComponentFixture<AddgenerateexpostfactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddgenerateexpostfactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgenerateexpostfactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
