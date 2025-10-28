import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MISInspectorViewComponent } from './misinspector-view.component';

describe('MISInspectorViewComponent', () => {
  let component: MISInspectorViewComponent;
  let fixture: ComponentFixture<MISInspectorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MISInspectorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MISInspectorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
