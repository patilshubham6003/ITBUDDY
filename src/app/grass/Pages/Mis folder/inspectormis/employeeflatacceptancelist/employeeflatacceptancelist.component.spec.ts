import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeflatacceptancelistComponent } from './employeeflatacceptancelist.component';

describe('EmployeeflatacceptancelistComponent', () => {
  let component: EmployeeflatacceptancelistComponent;
  let fixture: ComponentFixture<EmployeeflatacceptancelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeflatacceptancelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeflatacceptancelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
