import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAndMemorandomDrawerComponent } from './notification-and-memorandom-drawer.component';

describe('NotificationAndMemorandomDrawerComponent', () => {
  let component: NotificationAndMemorandomDrawerComponent;
  let fixture: ComponentFixture<NotificationAndMemorandomDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationAndMemorandomDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAndMemorandomDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
