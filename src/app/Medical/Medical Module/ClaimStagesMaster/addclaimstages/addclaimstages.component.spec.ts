import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclaimstagesComponent } from './addclaimstages.component';

describe('AddclaimstagesComponent', () => {
  let component: AddclaimstagesComponent;
  let fixture: ComponentFixture<AddclaimstagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddclaimstagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclaimstagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
