import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcdetailedreportComponent } from './ltcdetailedreport.component';

describe('LtcdetailedreportComponent', () => {
  let component: LtcdetailedreportComponent;
  let fixture: ComponentFixture<LtcdetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcdetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcdetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
