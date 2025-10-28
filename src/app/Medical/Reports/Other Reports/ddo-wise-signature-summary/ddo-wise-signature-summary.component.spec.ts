import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdoWiseSignatureSummaryComponent } from './ddo-wise-signature-summary.component';

describe('DdoWiseSignatureSummaryComponent', () => {
  let component: DdoWiseSignatureSummaryComponent;
  let fixture: ComponentFixture<DdoWiseSignatureSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdoWiseSignatureSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdoWiseSignatureSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
