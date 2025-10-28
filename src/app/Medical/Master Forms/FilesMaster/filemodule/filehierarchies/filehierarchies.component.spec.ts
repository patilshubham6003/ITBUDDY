import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilehierarchiesComponent } from './filehierarchies.component';

describe('FilehierarchiesComponent', () => {
  let component: FilehierarchiesComponent;
  let fixture: ComponentFixture<FilehierarchiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilehierarchiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilehierarchiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
