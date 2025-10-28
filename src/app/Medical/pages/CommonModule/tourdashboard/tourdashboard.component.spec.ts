import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourdashboardComponent } from './tourdashboard.component';

describe('TourdashboardComponent', () => {
  let component: TourdashboardComponent;
  let fixture: ComponentFixture<TourdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
