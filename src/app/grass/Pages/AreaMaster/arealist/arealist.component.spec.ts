import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArealistComponent } from './arealist.component';

describe('ArealistComponent', () => {
  let component: ArealistComponent;
  let fixture: ComponentFixture<ArealistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArealistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArealistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
