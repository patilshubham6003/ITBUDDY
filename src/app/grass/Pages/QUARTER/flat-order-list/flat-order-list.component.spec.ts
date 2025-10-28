import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatOrderListComponent } from './flat-order-list.component';

describe('FlatOrderListComponent', () => {
  let component: FlatOrderListComponent;
  let fixture: ComponentFixture<FlatOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
