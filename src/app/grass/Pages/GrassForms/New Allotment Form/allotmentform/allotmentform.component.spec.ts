import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentformComponent } from './allotmentform.component';

describe('AllotmentformComponent', () => {
  let component: AllotmentformComponent;
  let fixture: ComponentFixture<AllotmentformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
