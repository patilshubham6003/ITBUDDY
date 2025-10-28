import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeWiseClassWiseLtcCountltcComponent } from './mode-wise-class-wise-ltc-countltc.component';

describe('ModeWiseClassWiseLtcCountltcComponent', () => {
  let component: ModeWiseClassWiseLtcCountltcComponent;
  let fixture: ComponentFixture<ModeWiseClassWiseLtcCountltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeWiseClassWiseLtcCountltcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeWiseClassWiseLtcCountltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
