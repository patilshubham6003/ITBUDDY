import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilehierarchyComponent } from './filehierarchy.component';

describe('FilehierarchyComponent', () => {
  let component: FilehierarchyComponent;
  let fixture: ComponentFixture<FilehierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilehierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilehierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
