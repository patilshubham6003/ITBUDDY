import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionlistforInspectorComponent } from './objectionlistfor-inspector.component';

describe('ObjectionlistforInspectorComponent', () => {
  let component: ObjectionlistforInspectorComponent;
  let fixture: ComponentFixture<ObjectionlistforInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionlistforInspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectionlistforInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
