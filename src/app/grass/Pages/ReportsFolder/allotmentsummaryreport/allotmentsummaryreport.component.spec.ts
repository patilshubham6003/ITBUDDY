import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentsummaryreportComponent } from './allotmentsummaryreport.component';

describe('AllotmentsummaryreportComponent', () => {
  let component: AllotmentsummaryreportComponent;
  let fixture: ComponentFixture<AllotmentsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentsummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
