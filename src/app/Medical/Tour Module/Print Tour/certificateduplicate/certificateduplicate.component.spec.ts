import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateduplicateComponent } from './certificateduplicate.component';

describe('CertificateduplicateComponent', () => {
  let component: CertificateduplicateComponent;
  let fixture: ComponentFixture<CertificateduplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateduplicateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateduplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
