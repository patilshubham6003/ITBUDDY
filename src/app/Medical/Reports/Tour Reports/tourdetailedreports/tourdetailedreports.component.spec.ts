import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourdetailedreportsComponent } from './tourdetailedreports.component';

describe('TourdetailedreportsComponent', () => {
  let component: TourdetailedreportsComponent;
  let fixture: ComponentFixture<TourdetailedreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourdetailedreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourdetailedreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
