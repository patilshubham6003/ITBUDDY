import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatallotmentaddComponent } from './flatallotmentadd.component';

describe('FlatallotmentaddComponent', () => {
  let component: FlatallotmentaddComponent;
  let fixture: ComponentFixture<FlatallotmentaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatallotmentaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatallotmentaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
