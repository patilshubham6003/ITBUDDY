import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilemastertableComponent } from './filemastertable.component';

describe('FilemastertableComponent', () => {
  let component: FilemastertableComponent;
  let fixture: ComponentFixture<FilemastertableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilemastertableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilemastertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
