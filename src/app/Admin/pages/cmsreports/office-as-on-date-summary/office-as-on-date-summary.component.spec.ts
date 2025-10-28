import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAsOnDateSummaryComponent } from './office-as-on-date-summary.component';

describe('OfficeAsOnDateSummaryComponent', () => {
  let component: OfficeAsOnDateSummaryComponent;
  let fixture: ComponentFixture<OfficeAsOnDateSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeAsOnDateSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeAsOnDateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
