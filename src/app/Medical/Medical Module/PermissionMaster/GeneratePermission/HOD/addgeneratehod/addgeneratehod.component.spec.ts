import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgeneratehodComponent } from './addgeneratehod.component';

describe('AddgeneratehodComponent', () => {
  let component: AddgeneratehodComponent;
  let fixture: ComponentFixture<AddgeneratehodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddgeneratehodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgeneratehodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
