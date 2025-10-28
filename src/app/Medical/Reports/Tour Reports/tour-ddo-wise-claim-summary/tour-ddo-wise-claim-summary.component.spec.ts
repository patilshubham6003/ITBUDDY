import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDdoWiseClaimSummaryComponent } from './tour-ddo-wise-claim-summary.component';

describe('TourDdoWiseClaimSummaryComponent', () => {
  let component: TourDdoWiseClaimSummaryComponent;
  let fixture: ComponentFixture<TourDdoWiseClaimSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourDdoWiseClaimSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDdoWiseClaimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
