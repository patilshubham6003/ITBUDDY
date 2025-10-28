import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferlistadvanceComponent } from './transferlistadvance.component';

describe('TransferlistadvanceComponent', () => {
  let component: TransferlistadvanceComponent;
  let fixture: ComponentFixture<TransferlistadvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferlistadvanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferlistadvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
