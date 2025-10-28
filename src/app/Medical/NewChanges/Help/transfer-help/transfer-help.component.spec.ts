import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferHelpComponent } from './transfer-help.component';

describe('TransferHelpComponent', () => {
  let component: TransferHelpComponent;
  let fixture: ComponentFixture<TransferHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
