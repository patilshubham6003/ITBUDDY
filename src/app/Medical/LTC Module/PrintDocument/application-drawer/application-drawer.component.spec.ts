import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDrawerComponent } from './application-drawer.component';

describe('ApplicationDrawerComponent', () => {
  let component: ApplicationDrawerComponent;
  let fixture: ComponentFixture<ApplicationDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
