import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalallotmentlistmasterComponent } from './finalallotmentlistmaster.component';

describe('FinalallotmentlistmasterComponent', () => {
  let component: FinalallotmentlistmasterComponent;
  let fixture: ComponentFixture<FinalallotmentlistmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalallotmentlistmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalallotmentlistmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
