import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAndMemorandomMasterComponent } from './notification-and-memorandom-master.component';

describe('NotificationAndMemorandomMasterComponent', () => {
  let component: NotificationAndMemorandomMasterComponent;
  let fixture: ComponentFixture<NotificationAndMemorandomMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationAndMemorandomMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAndMemorandomMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
