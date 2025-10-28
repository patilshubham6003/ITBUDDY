import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpostletterComponent } from './expostletter.component';

describe('ExpostletterComponent', () => {
  let component: ExpostletterComponent;
  let fixture: ComponentFixture<ExpostletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpostletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpostletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
