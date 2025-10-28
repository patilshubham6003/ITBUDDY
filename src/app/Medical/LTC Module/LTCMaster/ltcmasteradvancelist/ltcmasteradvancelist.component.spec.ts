import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcmasteradvancelistComponent } from './ltcmasteradvancelist.component';

describe('LtcmasteradvancelistComponent', () => {
  let component: LtcmasteradvancelistComponent;
  let fixture: ComponentFixture<LtcmasteradvancelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcmasteradvancelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LtcmasteradvancelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
