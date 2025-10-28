import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShorttermbilldrwaerComponent } from './shorttermbilldrwaer.component';

describe('ShorttermbilldrwaerComponent', () => {
  let component: ShorttermbilldrwaerComponent;
  let fixture: ComponentFixture<ShorttermbilldrwaerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShorttermbilldrwaerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShorttermbilldrwaerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
