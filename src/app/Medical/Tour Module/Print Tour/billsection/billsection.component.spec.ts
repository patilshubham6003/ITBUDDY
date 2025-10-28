import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsectionComponent } from './billsection.component';

describe('BillsectionComponent', () => {
  let component: BillsectionComponent;
  let fixture: ComponentFixture<BillsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
