import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentFormComponent } from './allotment-form.component';

describe('AllotmentFormComponent', () => {
  let component: AllotmentFormComponent;
  let fixture: ComponentFixture<AllotmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
