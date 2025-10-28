import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDrawerComponent } from './exam-drawer.component';

describe('ExamDrawerComponent', () => {
  let component: ExamDrawerComponent;
  let fixture: ComponentFixture<ExamDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
