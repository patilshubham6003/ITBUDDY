import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGradPayComponent } from './add-grad-pay.component';

describe('AddGradPayComponent', () => {
  let component: AddGradPayComponent;
  let fixture: ComponentFixture<AddGradPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGradPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGradPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
