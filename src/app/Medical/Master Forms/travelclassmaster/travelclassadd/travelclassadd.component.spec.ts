import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelclassaddComponent } from './travelclassadd.component';

describe('TravelclassaddComponent', () => {
  let component: TravelclassaddComponent;
  let fixture: ComponentFixture<TravelclassaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelclassaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelclassaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
