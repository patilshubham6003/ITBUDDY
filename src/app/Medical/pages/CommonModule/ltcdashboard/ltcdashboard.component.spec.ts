import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LTCdashboardComponent } from './ltcdashboard.component';

describe('LTCdashboardComponent', () => {
  let component: LTCdashboardComponent;
  let fixture: ComponentFixture<LTCdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LTCdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LTCdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
