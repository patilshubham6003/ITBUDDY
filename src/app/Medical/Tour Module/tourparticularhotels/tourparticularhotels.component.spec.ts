import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourparticularhotelsComponent } from './tourparticularhotels.component';

describe('TourparticularhotelsComponent', () => {
  let component: TourparticularhotelsComponent;
  let fixture: ComponentFixture<TourparticularhotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourparticularhotelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourparticularhotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
