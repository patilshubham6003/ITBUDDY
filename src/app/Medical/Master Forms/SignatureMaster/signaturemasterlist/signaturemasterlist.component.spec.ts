import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturemasterlistComponent } from './signaturemasterlist.component';

describe('SignaturemasterlistComponent', () => {
  let component: SignaturemasterlistComponent;
  let fixture: ComponentFixture<SignaturemasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturemasterlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignaturemasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
