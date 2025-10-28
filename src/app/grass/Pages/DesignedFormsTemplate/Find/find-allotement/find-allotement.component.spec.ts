import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAllotementComponent } from './find-allotement.component';

describe('FindAllotementComponent', () => {
  let component: FindAllotementComponent;
  let fixture: ComponentFixture<FindAllotementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindAllotementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindAllotementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
