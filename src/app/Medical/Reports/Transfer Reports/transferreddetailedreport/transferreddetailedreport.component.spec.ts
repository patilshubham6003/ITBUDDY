import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferreddetailedreportComponent } from './transferreddetailedreport.component';

describe('TransferreddetailedreportComponent', () => {
  let component: TransferreddetailedreportComponent;
  let fixture: ComponentFixture<TransferreddetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferreddetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferreddetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
