import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionComponent } from './objection.component';

describe('ObjectionComponent', () => {
  let component: ObjectionComponent;
  let fixture: ComponentFixture<ObjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
