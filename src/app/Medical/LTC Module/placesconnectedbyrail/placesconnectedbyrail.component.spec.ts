import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesconnectedbyrailComponent } from './placesconnectedbyrail.component';

describe('PlacesconnectedbyrailComponent', () => {
  let component: PlacesconnectedbyrailComponent;
  let fixture: ComponentFixture<PlacesconnectedbyrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesconnectedbyrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesconnectedbyrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
