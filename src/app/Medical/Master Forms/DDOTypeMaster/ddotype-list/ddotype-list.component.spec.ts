import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DDOTypeListComponent } from './ddotype-list.component';

describe('DDOTypeListComponent', () => {
  let component: DDOTypeListComponent;
  let fixture: ComponentFixture<DDOTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DDOTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DDOTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
