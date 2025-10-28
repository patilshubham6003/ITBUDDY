import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatAllotmentListComponent } from './flat-allotment-list.component';

describe('FlatAllotmentListComponent', () => {
  let component: FlatAllotmentListComponent;
  let fixture: ComponentFixture<FlatAllotmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatAllotmentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatAllotmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
