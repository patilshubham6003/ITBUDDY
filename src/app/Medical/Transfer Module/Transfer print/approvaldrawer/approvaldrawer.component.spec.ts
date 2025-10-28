import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovaldrawerComponent } from './approvaldrawer.component';

describe('ApprovaldrawerComponent', () => {
  let component: ApprovaldrawerComponent;
  let fixture: ComponentFixture<ApprovaldrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovaldrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovaldrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
