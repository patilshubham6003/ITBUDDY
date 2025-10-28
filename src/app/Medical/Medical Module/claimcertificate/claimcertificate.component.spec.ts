import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimcertificateComponent } from './claimcertificate.component';

describe('ClaimcertificateComponent', () => {
  let component: ClaimcertificateComponent;
  let fixture: ComponentFixture<ClaimcertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimcertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimcertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
