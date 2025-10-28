import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GARDrawerComponent } from './gardrawer.component';

describe('GARDrawerComponent', () => {
  let component: GARDrawerComponent;
  let fixture: ComponentFixture<GARDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GARDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GARDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
