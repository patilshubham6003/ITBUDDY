import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodletterComponent } from './hodletter.component';

describe('HodletterComponent', () => {
  let component: HodletterComponent;
  let fixture: ComponentFixture<HodletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HodletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HodletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
