import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfDeclarationCertificateComponent } from './self-declaration-certificate.component';

describe('SelfDeclarationCertificateComponent', () => {
  let component: SelfDeclarationCertificateComponent;
  let fixture: ComponentFixture<SelfDeclarationCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfDeclarationCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfDeclarationCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
