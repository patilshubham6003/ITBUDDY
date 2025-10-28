import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimstageslistComponent } from './claimstageslist.component';

describe('ClaimstageslistComponent', () => {
  let component: ClaimstageslistComponent;
  let fixture: ComponentFixture<ClaimstageslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimstageslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimstageslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
