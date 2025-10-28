import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DDOTypeDetailsAddComponent } from './ddotype-details-add.component';

describe('DDOTypeDetailsAddComponent', () => {
  let component: DDOTypeDetailsAddComponent;
  let fixture: ComponentFixture<DDOTypeDetailsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DDOTypeDetailsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DDOTypeDetailsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
