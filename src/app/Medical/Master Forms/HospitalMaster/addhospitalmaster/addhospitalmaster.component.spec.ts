import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhospitalmasterComponent } from './addhospitalmaster.component';

describe('AddhospitalmasterComponent', () => {
  let component: AddhospitalmasterComponent;
  let fixture: ComponentFixture<AddhospitalmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddhospitalmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddhospitalmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
