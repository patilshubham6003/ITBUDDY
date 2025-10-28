import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatvacantdetailsreportComponent } from './flatvacantdetailsreport.component';

describe('FlatvacantdetailsreportComponent', () => {
  let component: FlatvacantdetailsreportComponent;
  let fixture: ComponentFixture<FlatvacantdetailsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatvacantdetailsreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatvacantdetailsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
