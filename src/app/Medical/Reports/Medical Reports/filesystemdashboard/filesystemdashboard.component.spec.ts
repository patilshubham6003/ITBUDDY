import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesystemdashboardComponent } from './filesystemdashboard.component';

describe('FilesystemdashboardComponent', () => {
  let component: FilesystemdashboardComponent;
  let fixture: ComponentFixture<FilesystemdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesystemdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesystemdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
