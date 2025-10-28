import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencefilleddetailsummaryreportComponent } from './preferencefilleddetailsummaryreport.component';

describe('PreferencefilleddetailsummaryreportComponent', () => {
  let component: PreferencefilleddetailsummaryreportComponent;
  let fixture: ComponentFixture<PreferencefilleddetailsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencefilleddetailsummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencefilleddetailsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
