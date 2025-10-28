import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AaykarbhvanComponent } from './aaykarbhvan.component';

describe('AaykarbhvanComponent', () => {
  let component: AaykarbhvanComponent;
  let fixture: ComponentFixture<AaykarbhvanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AaykarbhvanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AaykarbhvanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
