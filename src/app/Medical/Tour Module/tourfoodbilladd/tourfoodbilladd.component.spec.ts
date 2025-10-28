import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourfoodbilladdComponent } from './tourfoodbilladd.component';

describe('TourfoodbilladdComponent', () => {
  let component: TourfoodbilladdComponent;
  let fixture: ComponentFixture<TourfoodbilladdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourfoodbilladdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourfoodbilladdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
