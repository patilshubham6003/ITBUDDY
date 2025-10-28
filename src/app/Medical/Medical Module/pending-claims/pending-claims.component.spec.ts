import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingClaimsComponent } from './pending-claims.component';

describe('PendingClaimsComponent', () => {
  let component: PendingClaimsComponent;
  let fixture: ComponentFixture<PendingClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
