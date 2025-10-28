import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetourlistComponent } from './employeetourlist.component';

describe('EmployeetourlistComponent', () => {
  let component: EmployeetourlistComponent;
  let fixture: ComponentFixture<EmployeetourlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeetourlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetourlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
