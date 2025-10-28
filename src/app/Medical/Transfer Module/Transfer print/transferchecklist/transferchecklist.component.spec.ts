import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferchecklistComponent } from './transferchecklist.component';

describe('TransferchecklistComponent', () => {
  let component: TransferchecklistComponent;
  let fixture: ComponentFixture<TransferchecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferchecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferchecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
