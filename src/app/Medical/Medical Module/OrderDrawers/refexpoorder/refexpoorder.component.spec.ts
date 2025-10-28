import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefexpoorderComponent } from './refexpoorder.component';

describe('RefexpoorderComponent', () => {
  let component: RefexpoorderComponent;
  let fixture: ComponentFixture<RefexpoorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefexpoorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefexpoorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
