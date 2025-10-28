import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelclasslistComponent } from './travelclasslist.component';

describe('TravelclasslistComponent', () => {
  let component: TravelclasslistComponent;
  let fixture: ComponentFixture<TravelclasslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelclasslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelclasslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
