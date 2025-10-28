import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratesenioritylistComponent } from './generatesenioritylist.component';

describe('GeneratesenioritylistComponent', () => {
  let component: GeneratesenioritylistComponent;
  let fixture: ComponentFixture<GeneratesenioritylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratesenioritylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratesenioritylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
