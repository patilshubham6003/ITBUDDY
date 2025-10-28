import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgeneratedelaycondonationComponent } from './addgeneratedelaycondonation.component';

describe('AddgeneratedelaycondonationComponent', () => {
  let component: AddgeneratedelaycondonationComponent;
  let fixture: ComponentFixture<AddgeneratedelaycondonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddgeneratedelaycondonationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgeneratedelaycondonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
