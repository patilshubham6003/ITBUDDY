import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitytourComponent } from './citytour.component';

describe('CitytourComponent', () => {
  let component: CitytourComponent;
  let fixture: ComponentFixture<CitytourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitytourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitytourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
