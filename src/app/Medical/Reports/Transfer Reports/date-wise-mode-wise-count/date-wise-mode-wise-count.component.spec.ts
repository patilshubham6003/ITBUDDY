import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateWiseModeWiseCountComponent } from './date-wise-mode-wise-count.component';

describe('DateWiseModeWiseCountComponent', () => {
  let component: DateWiseModeWiseCountComponent;
  let fixture: ComponentFixture<DateWiseModeWiseCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateWiseModeWiseCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateWiseModeWiseCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
