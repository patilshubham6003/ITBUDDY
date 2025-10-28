import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabasetablemasterlistComponent } from './databasetablemasterlist.component';

describe('DatabasetablemasterlistComponent', () => {
  let component: DatabasetablemasterlistComponent;
  let fixture: ComponentFixture<DatabasetablemasterlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabasetablemasterlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabasetablemasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
