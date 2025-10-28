import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionhistoryComponent } from './objectionhistory.component';

describe('ObjectionhistoryComponent', () => {
  let component: ObjectionhistoryComponent;
  let fixture: ComponentFixture<ObjectionhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionhistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectionhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
