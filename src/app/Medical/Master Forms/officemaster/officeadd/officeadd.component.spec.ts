import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeaddComponent } from './officeadd.component';

describe('OfficeaddComponent', () => {
  let component: OfficeaddComponent;
  let fixture: ComponentFixture<OfficeaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
