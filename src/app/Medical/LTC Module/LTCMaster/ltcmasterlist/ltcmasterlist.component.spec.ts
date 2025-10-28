import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcmasterlistComponent } from './ltcmasterlist.component';

describe('LtcmasterlistComponent', () => {
  let component: LtcmasterlistComponent;
  let fixture: ComponentFixture<LtcmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcmasterlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
