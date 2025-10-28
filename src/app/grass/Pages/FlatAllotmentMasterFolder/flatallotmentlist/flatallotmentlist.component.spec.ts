import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatallotmentlistComponent } from './flatallotmentlist.component';

describe('FlatallotmentlistComponent', () => {
  let component: FlatallotmentlistComponent;
  let fixture: ComponentFixture<FlatallotmentlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatallotmentlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatallotmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
