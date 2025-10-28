import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelInvestigationRateComponent } from './import-excel-investigation-rate.component';

describe('ImportExcelInvestigationRateComponent', () => {
  let component: ImportExcelInvestigationRateComponent;
  let fixture: ComponentFixture<ImportExcelInvestigationRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExcelInvestigationRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExcelInvestigationRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
