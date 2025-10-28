import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourHelpComponent } from './tour-help.component';

describe('TourHelpComponent', () => {
  let component: TourHelpComponent;
  let fixture: ComponentFixture<TourHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
