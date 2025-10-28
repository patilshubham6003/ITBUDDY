import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationForGrantTransferAdvComponent } from './application-for-grant-transfer-adv.component';

describe('ApplicationForGrantTransferAdvComponent', () => {
  let component: ApplicationForGrantTransferAdvComponent;
  let fixture: ComponentFixture<ApplicationForGrantTransferAdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationForGrantTransferAdvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationForGrantTransferAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
