import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkflatvacantinspectorComponent } from './bulkflatvacantinspector.component';

describe('BulkflatvacantinspectorComponent', () => {
  let component: BulkflatvacantinspectorComponent;
  let fixture: ComponentFixture<BulkflatvacantinspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkflatvacantinspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkflatvacantinspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
