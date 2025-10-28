import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcsanstionorderComponent } from './ltcsanstionorder.component';

describe('LtcsanstionorderComponent', () => {
  let component: LtcsanstionorderComponent;
  let fixture: ComponentFixture<LtcsanstionorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtcsanstionorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcsanstionorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
