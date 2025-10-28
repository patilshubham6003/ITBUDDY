import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDdoWiseClaimDetailedComponent } from './tour-ddo-wise-claim-detailed.component';

describe('TourDdoWiseClaimDetailedComponent', () => {
  let component: TourDdoWiseClaimDetailedComponent;
  let fixture: ComponentFixture<TourDdoWiseClaimDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDdoWiseClaimDetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDdoWiseClaimDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
