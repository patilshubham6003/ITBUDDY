import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddblockyearComponent } from './addblockyear.component';

describe('AddblockyearComponent', () => {
  let component: AddblockyearComponent;
  let fixture: ComponentFixture<AddblockyearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddblockyearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddblockyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
