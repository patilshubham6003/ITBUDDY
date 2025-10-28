import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayorderComponent } from './delayorder.component';

describe('DelayorderComponent', () => {
  let component: DelayorderComponent;
  let fixture: ComponentFixture<DelayorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelayorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelayorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
