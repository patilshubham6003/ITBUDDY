import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentObjectionlistComponent } from './allotment-objectionlist.component';

describe('AllotmentObjectionlistComponent', () => {
  let component: AllotmentObjectionlistComponent;
  let fixture: ComponentFixture<AllotmentObjectionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentObjectionlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentObjectionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
