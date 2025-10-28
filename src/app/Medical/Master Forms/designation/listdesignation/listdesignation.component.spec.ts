import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdesignationComponent } from './listdesignation.component';

describe('ListdesignationComponent', () => {
  let component: ListdesignationComponent;
  let fixture: ComponentFixture<ListdesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListdesignationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListdesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
