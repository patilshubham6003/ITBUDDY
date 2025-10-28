import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotatradvComponent } from './gotatradv.component';

describe('GotatradvComponent', () => {
  let component: GotatradvComponent;
  let fixture: ComponentFixture<GotatradvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GotatradvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GotatradvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
