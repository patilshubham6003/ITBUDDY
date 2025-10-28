import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatallotmentuserlistComponent } from './flatallotmentuserlist.component';

describe('FlatallotmentuserlistComponent', () => {
  let component: FlatallotmentuserlistComponent;
  let fixture: ComponentFixture<FlatallotmentuserlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatallotmentuserlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatallotmentuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
