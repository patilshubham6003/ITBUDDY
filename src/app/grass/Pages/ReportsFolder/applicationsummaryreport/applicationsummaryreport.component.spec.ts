import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsummaryreportComponent } from './applicationsummaryreport.component';

describe('ApplicationsummaryreportComponent', () => {
  let component: ApplicationsummaryreportComponent;
  let fixture: ComponentFixture<ApplicationsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationsummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
