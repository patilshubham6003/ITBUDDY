import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardmasterlistComponent } from './forwardmasterlist.component';

describe('ForwardmasterlistComponent', () => {
  let component: ForwardmasterlistComponent;
  let fixture: ComponentFixture<ForwardmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardmasterlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
