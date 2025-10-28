import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpreportComponent } from './otpreport.component';

describe('OtpreportComponent', () => {
  let component: OtpreportComponent;
  let fixture: ComponentFixture<OtpreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
