import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrenderforminspectorComponent } from './surrenderforminspector.component';

describe('SurrenderforminspectorComponent', () => {
  let component: SurrenderforminspectorComponent;
  let fixture: ComponentFixture<SurrenderforminspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurrenderforminspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurrenderforminspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
