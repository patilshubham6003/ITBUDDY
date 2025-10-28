import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DDOTypeAddComponent } from './ddotype-add.component';

describe('DDOTypeAddComponent', () => {
  let component: DDOTypeAddComponent;
  let fixture: ComponentFixture<DDOTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DDOTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DDOTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
