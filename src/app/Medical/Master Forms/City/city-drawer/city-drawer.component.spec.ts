import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDrawerComponent } from './city-drawer.component';

describe('CityDrawerComponent', () => {
  let component: CityDrawerComponent;
  let fixture: ComponentFixture<CityDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
