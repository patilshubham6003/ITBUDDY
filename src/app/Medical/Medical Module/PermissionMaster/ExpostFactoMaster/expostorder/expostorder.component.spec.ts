import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpostorderComponent } from './expostorder.component';

describe('ExpostorderComponent', () => {
  let component: ExpostorderComponent;
  let fixture: ComponentFixture<ExpostorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpostorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpostorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
