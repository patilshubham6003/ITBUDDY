import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveapplicationslistComponent } from './approveapplicationslist.component';

describe('ApproveapplicationslistComponent', () => {
  let component: ApproveapplicationslistComponent;
  let fixture: ComponentFixture<ApproveapplicationslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveapplicationslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveapplicationslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
