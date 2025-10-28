import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenioritysummaryreportComponent } from './senioritysummaryreport.component';

describe('SenioritysummaryreportComponent', () => {
  let component: SenioritysummaryreportComponent;
  let fixture: ComponentFixture<SenioritysummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenioritysummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenioritysummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
