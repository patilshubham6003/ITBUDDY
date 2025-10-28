import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetransferlistComponent } from './employeetransferlist.component';

describe('EmployeetransferlistComponent', () => {
  let component: EmployeetransferlistComponent;
  let fixture: ComponentFixture<EmployeetransferlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeetransferlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetransferlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
