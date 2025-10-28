import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefhodorderComponent } from './refhodorder.component';

describe('RefhodorderComponent', () => {
  let component: RefhodorderComponent;
  let fixture: ComponentFixture<RefhodorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefhodorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefhodorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
