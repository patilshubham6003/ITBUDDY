import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartAComponent } from './part-a.component';

describe('PartAComponent', () => {
  let component: PartAComponent;
  let fixture: ComponentFixture<PartAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
