import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaycondolationlistComponent } from './delaycondolationlist.component';

describe('DelaycondolationlistComponent', () => {
  let component: DelaycondolationlistComponent;
  let fixture: ComponentFixture<DelaycondolationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelaycondolationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelaycondolationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
