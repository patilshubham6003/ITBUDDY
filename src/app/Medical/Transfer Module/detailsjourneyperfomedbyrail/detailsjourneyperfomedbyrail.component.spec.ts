import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsjourneyperfomedbyrailComponent } from './detailsjourneyperfomedbyrail.component';

describe('DetailsjourneyperfomedbyrailComponent', () => {
  let component: DetailsjourneyperfomedbyrailComponent;
  let fixture: ComponentFixture<DetailsjourneyperfomedbyrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsjourneyperfomedbyrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsjourneyperfomedbyrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
