import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretakerwiseFlatDetailedReportComponent } from './caretakerwise-flat-detailed-report.component';

describe('CaretakerwiseFlatDetailedReportComponent', () => {
  let component: CaretakerwiseFlatDetailedReportComponent;
  let fixture: ComponentFixture<CaretakerwiseFlatDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretakerwiseFlatDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretakerwiseFlatDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
