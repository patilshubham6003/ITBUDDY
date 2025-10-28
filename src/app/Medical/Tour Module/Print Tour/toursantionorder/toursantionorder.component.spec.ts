import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursantionorderComponent } from './toursantionorder.component';

describe('ToursantionorderComponent', () => {
  let component: ToursantionorderComponent;
  let fixture: ComponentFixture<ToursantionorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToursantionorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToursantionorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
