import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingretirmentreportComponent } from './upcomingretirmentreport.component';

describe('UpcomingretirmentreportComponent', () => {
  let component: UpcomingretirmentreportComponent;
  let fixture: ComponentFixture<UpcomingretirmentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingretirmentreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingretirmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
