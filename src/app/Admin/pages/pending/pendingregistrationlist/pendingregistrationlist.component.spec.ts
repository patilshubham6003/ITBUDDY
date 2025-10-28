import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingregistrationlistComponent } from './pendingregistrationlist.component';

describe('PendingregistrationlistComponent', () => {
  let component: PendingregistrationlistComponent;
  let fixture: ComponentFixture<PendingregistrationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingregistrationlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingregistrationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
