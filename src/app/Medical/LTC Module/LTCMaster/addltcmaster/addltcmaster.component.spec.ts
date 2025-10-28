import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddltcmasterComponent } from './addltcmaster.component';

describe('AddltcmasterComponent', () => {
  let component: AddltcmasterComponent;
  let fixture: ComponentFixture<AddltcmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddltcmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddltcmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
