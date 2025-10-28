import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclaimmasterComponent } from './addclaimmaster.component';

describe('AddclaimmasterComponent', () => {
  let component: AddclaimmasterComponent;
  let fixture: ComponentFixture<AddclaimmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddclaimmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclaimmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
