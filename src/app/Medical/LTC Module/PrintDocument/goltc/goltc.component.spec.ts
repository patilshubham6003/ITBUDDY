import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoltcComponent } from './goltc.component';

describe('GoltcComponent', () => {
  let component: GoltcComponent;
  let fixture: ComponentFixture<GoltcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoltcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
