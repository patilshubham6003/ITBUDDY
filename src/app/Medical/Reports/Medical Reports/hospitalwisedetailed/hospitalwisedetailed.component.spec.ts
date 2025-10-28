import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalwisedetailedComponent } from './hospitalwisedetailed.component';

describe('HospitalwisedetailedComponent', () => {
  let component: HospitalwisedetailedComponent;
  let fixture: ComponentFixture<HospitalwisedetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalwisedetailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalwisedetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
