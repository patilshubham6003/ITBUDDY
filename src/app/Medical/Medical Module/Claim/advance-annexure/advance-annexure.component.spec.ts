import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceAnnexureComponent } from './advance-annexure.component';

describe('AdvanceAnnexureComponent', () => {
  let component: AdvanceAnnexureComponent;
  let fixture: ComponentFixture<AdvanceAnnexureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceAnnexureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceAnnexureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
