import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendingClaimComponent } from './list-pending-claim.component';

describe('ListPendingClaimComponent', () => {
  let component: ListPendingClaimComponent;
  let fixture: ComponentFixture<ListPendingClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPendingClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPendingClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
