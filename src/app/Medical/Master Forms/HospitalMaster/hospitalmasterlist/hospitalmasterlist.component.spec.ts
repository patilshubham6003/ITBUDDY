import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalmasterlistComponent } from './hospitalmasterlist.component';

describe('HospitalmasterlistComponent', () => {
  let component: HospitalmasterlistComponent;
  let fixture: ComponentFixture<HospitalmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalmasterlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
