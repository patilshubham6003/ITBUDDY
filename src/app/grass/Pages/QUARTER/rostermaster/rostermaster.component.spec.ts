import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RostermasterComponent } from './rostermaster.component';

describe('RostermasterComponent', () => {
  let component: RostermasterComponent;
  let fixture: ComponentFixture<RostermasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RostermasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RostermasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
