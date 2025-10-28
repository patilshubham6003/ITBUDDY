import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatOrderDrawerComponent } from './flat-order-drawer.component';

describe('FlatOrderDrawerComponent', () => {
  let component: FlatOrderDrawerComponent;
  let fixture: ComponentFixture<FlatOrderDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatOrderDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatOrderDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
