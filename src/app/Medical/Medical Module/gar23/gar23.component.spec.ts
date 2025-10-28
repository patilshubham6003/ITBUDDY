import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAR23Component } from './gar23.component';

describe('GAR23Component', () => {
  let component: GAR23Component;
  let fixture: ComponentFixture<GAR23Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GAR23Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GAR23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
