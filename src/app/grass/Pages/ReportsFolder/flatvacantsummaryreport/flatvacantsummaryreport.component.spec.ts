import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatvacantsummaryreportComponent } from './flatvacantsummaryreport.component';

describe('FlatvacantsummaryreportComponent', () => {
  let component: FlatvacantsummaryreportComponent;
  let fixture: ComponentFixture<FlatvacantsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatvacantsummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatvacantsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
