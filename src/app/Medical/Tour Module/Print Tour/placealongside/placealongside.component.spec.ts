import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacealongsideComponent } from './placealongside.component';

describe('PlacealongsideComponent', () => {
  let component: PlacealongsideComponent;
  let fixture: ComponentFixture<PlacealongsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacealongsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacealongsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
