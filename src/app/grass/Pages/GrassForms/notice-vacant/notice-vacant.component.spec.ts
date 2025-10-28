import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeVacantComponent } from './notice-vacant.component';

describe('NoticeVacantComponent', () => {
  let component: NoticeVacantComponent;
  let fixture: ComponentFixture<NoticeVacantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeVacantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeVacantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
