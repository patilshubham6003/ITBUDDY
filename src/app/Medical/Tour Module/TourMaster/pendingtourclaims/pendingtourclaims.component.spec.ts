import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingtourclaimsComponent } from './pendingtourclaims.component';

describe('PendingtourclaimsComponent', () => {
  let component: PendingtourclaimsComponent;
  let fixture: ComponentFixture<PendingtourclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingtourclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingtourclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
