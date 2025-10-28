import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkflatvacantcaretakerComponent } from './bulkflatvacantcaretaker.component';

describe('BulkflatvacantcaretakerComponent', () => {
  let component: BulkflatvacantcaretakerComponent;
  let fixture: ComponentFixture<BulkflatvacantcaretakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkflatvacantcaretakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkflatvacantcaretakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
