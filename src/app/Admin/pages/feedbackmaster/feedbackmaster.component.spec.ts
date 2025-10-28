import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackmasterComponent } from './feedbackmaster.component';

describe('FeedbackmasterComponent', () => {
  let component: FeedbackmasterComponent;
  let fixture: ComponentFixture<FeedbackmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
