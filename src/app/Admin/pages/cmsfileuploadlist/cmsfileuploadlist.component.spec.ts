import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsfileuploadlistComponent } from './cmsfileuploadlist.component';

describe('CmsfileuploadlistComponent', () => {
  let component: CmsfileuploadlistComponent;
  let fixture: ComponentFixture<CmsfileuploadlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsfileuploadlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsfileuploadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
