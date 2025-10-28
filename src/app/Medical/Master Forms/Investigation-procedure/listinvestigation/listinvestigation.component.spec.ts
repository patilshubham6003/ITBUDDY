import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListinvestigationComponent } from './listinvestigation.component';

describe('ListinvestigationComponent', () => {
  let component: ListinvestigationComponent;
  let fixture: ComponentFixture<ListinvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListinvestigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListinvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
