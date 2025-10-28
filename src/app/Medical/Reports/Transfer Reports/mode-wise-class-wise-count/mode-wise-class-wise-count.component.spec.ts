import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeWiseClassWiseCountComponent } from './mode-wise-class-wise-count.component';

describe('ModeWiseClassWiseCountComponent', () => {
  let component: ModeWiseClassWiseCountComponent;
  let fixture: ComponentFixture<ModeWiseClassWiseCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeWiseClassWiseCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeWiseClassWiseCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
