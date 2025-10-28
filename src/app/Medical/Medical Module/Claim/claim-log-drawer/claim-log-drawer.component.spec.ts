import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimLogDrawerComponent } from './claim-log-drawer.component';

describe('ClaimLogDrawerComponent', () => {
  let component: ClaimLogDrawerComponent;
  let fixture: ComponentFixture<ClaimLogDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimLogDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimLogDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
