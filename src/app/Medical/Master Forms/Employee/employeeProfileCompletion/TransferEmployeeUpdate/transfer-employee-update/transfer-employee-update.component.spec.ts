import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferEmployeeUpdateComponent } from './transfer-employee-update.component';

describe('TransferEmployeeUpdateComponent', () => {
  let component: TransferEmployeeUpdateComponent;
  let fixture: ComponentFixture<TransferEmployeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferEmployeeUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferEmployeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
