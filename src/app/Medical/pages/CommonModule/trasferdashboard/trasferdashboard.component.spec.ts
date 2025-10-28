import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasferdashboardComponent } from './trasferdashboard.component';

describe('TrasferdashboardComponent', () => {
  let component: TrasferdashboardComponent;
  let fixture: ComponentFixture<TrasferdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrasferdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasferdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
