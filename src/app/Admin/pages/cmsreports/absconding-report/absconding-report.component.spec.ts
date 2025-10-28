import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbscondingReportComponent } from './absconding-report.component';

describe('AbscondingReportComponent', () => {
  let component: AbscondingReportComponent;
  let fixture: ComponentFixture<AbscondingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbscondingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbscondingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
