import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourmasterlistadvanceComponent } from './tourmasterlistadvance.component';

describe('TourmasterlistadvanceComponent', () => {
  let component: TourmasterlistadvanceComponent;
  let fixture: ComponentFixture<TourmasterlistadvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourmasterlistadvanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourmasterlistadvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
