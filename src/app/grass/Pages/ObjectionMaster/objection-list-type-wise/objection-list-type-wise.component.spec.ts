import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionListTypeWiseComponent } from './objection-list-type-wise.component';

describe('ObjectionListTypeWiseComponent', () => {
  let component: ObjectionListTypeWiseComponent;
  let fixture: ComponentFixture<ObjectionListTypeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionListTypeWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectionListTypeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
