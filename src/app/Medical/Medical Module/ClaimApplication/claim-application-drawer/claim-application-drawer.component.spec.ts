import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimApplicationDrawerComponent } from './claim-application-drawer.component';

describe('ClaimApplicationDrawerComponent', () => {
  let component: ClaimApplicationDrawerComponent;
  let fixture: ComponentFixture<ClaimApplicationDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimApplicationDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimApplicationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
