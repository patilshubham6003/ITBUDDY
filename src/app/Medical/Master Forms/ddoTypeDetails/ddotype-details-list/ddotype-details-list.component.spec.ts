import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DDOTypeDetailsListComponent } from './ddotype-details-list.component';

describe('DDOTypeDetailsListComponent', () => {
  let component: DDOTypeDetailsListComponent;
  let fixture: ComponentFixture<DDOTypeDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DDOTypeDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DDOTypeDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
