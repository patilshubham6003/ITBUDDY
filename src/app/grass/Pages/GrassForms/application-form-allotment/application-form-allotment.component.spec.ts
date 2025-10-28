import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormAllotmentComponent } from './application-form-allotment.component';

describe('ApplicationFormAllotmentComponent', () => {
  let component: ApplicationFormAllotmentComponent;
  let fixture: ComponentFixture<ApplicationFormAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationFormAllotmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationFormAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
