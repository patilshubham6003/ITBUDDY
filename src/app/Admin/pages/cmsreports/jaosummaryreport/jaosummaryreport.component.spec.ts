import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaosummaryreportComponent } from './jaosummaryreport.component';

describe('JaosummaryreportComponent', () => {
  let component: JaosummaryreportComponent;
  let fixture: ComponentFixture<JaosummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaosummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JaosummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
