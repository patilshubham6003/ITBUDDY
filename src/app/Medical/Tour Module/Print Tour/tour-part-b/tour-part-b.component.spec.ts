import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPartBComponent } from './tour-part-b.component';

describe('TourPartBComponent', () => {
  let component: TourPartBComponent;
  let fixture: ComponentFixture<TourPartBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourPartBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
