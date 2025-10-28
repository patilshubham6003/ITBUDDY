import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatAllotmentAddComponent } from './flat-allotment-add.component';

describe('FlatAllotmentAddComponent', () => {
  let component: FlatAllotmentAddComponent;
  let fixture: ComponentFixture<FlatAllotmentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatAllotmentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatAllotmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
