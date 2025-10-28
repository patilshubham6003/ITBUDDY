import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsofjourneyComponent } from './detailsofjourney.component';

describe('DetailsofjourneyComponent', () => {
  let component: DetailsofjourneyComponent;
  let fixture: ComponentFixture<DetailsofjourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsofjourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsofjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
