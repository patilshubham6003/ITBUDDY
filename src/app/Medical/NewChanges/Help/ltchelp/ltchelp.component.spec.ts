import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LTCHelpComponent } from './ltchelp.component';

describe('LTCHelpComponent', () => {
  let component: LTCHelpComponent;
  let fixture: ComponentFixture<LTCHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LTCHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LTCHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
