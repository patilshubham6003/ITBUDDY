import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddelaycondolationComponent } from './adddelaycondolation.component';

describe('AdddelaycondolationComponent', () => {
  let component: AdddelaycondolationComponent;
  let fixture: ComponentFixture<AdddelaycondolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddelaycondolationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddelaycondolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
