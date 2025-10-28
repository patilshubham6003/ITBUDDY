import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGradPayComponent } from './list-grad-pay.component';

describe('ListGradPayComponent', () => {
  let component: ListGradPayComponent;
  let fixture: ComponentFixture<ListGradPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGradPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGradPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
