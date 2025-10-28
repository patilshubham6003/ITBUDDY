import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceorderltcComponent } from './advanceorderltc.component';

describe('AdvanceorderltcComponent', () => {
  let component: AdvanceorderltcComponent;
  let fixture: ComponentFixture<AdvanceorderltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceorderltcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceorderltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
