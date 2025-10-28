import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaderwisesummaryreportComponent } from './caderwisesummaryreport.component';

describe('CaderwisesummaryreportComponent', () => {
  let component: CaderwisesummaryreportComponent;
  let fixture: ComponentFixture<CaderwisesummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaderwisesummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaderwisesummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
