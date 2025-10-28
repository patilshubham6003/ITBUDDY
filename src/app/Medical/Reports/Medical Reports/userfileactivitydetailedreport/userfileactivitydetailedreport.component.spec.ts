import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfileactivitydetailedreportComponent } from './userfileactivitydetailedreport.component';

describe('UserfileactivitydetailedreportComponent', () => {
  let component: UserfileactivitydetailedreportComponent;
  let fixture: ComponentFixture<UserfileactivitydetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserfileactivitydetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserfileactivitydetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
