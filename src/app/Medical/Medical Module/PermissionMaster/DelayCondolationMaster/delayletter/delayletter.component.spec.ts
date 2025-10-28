import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayletterComponent } from './delayletter.component';

describe('DelayletterComponent', () => {
  let component: DelayletterComponent;
  let fixture: ComponentFixture<DelayletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelayletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelayletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
