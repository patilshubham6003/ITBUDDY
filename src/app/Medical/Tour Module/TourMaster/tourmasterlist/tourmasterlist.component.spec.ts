import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourmasterlistComponent } from './tourmasterlist.component';

describe('TourmasterlistComponent', () => {
  let component: TourmasterlistComponent;
  let fixture: ComponentFixture<TourmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourmasterlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
