import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadithrfilelistComponent } from './uploadithrfilelist.component';

describe('UploadithrfilelistComponent', () => {
  let component: UploadithrfilelistComponent;
  let fixture: ComponentFixture<UploadithrfilelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadithrfilelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadithrfilelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
