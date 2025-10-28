import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetouraddComponent } from './employeetouradd.component';

describe('EmployeetouraddComponent', () => {
  let component: EmployeetouraddComponent;
  let fixture: ComponentFixture<EmployeetouraddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeetouraddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetouraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
