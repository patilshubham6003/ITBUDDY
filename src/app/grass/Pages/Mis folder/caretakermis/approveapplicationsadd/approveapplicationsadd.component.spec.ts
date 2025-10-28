import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveapplicationsaddComponent } from './approveapplicationsadd.component';

describe('ApproveapplicationsaddComponent', () => {
  let component: ApproveapplicationsaddComponent;
  let fixture: ComponentFixture<ApproveapplicationsaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveapplicationsaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveapplicationsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
