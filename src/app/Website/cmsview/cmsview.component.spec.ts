import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsviewComponent } from './cmsview.component';

describe('CmsviewComponent', () => {
  let component: CmsviewComponent;
  let fixture: ComponentFixture<CmsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
