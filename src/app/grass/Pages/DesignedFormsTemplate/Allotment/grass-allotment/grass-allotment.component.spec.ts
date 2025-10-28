import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassAllotmentComponent } from './grass-allotment.component';

describe('GrassAllotmentComponent', () => {
  let component: GrassAllotmentComponent;
  let fixture: ComponentFixture<GrassAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrassAllotmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrassAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
