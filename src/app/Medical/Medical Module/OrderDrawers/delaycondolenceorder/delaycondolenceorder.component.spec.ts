import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaycondolenceorderComponent } from './delaycondolenceorder.component';

describe('DelaycondolenceorderComponent', () => {
  let component: DelaycondolenceorderComponent;
  let fixture: ComponentFixture<DelaycondolenceorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelaycondolenceorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelaycondolenceorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
