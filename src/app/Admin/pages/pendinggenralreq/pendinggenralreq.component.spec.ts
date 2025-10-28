import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendinggenralreqComponent } from './pendinggenralreq.component';

describe('PendinggenralreqComponent', () => {
  let component: PendinggenralreqComponent;
  let fixture: ComponentFixture<PendinggenralreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendinggenralreqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendinggenralreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
