import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsprofilepageComponent } from './cmsprofilepage.component';

describe('CmsprofilepageComponent', () => {
  let component: CmsprofilepageComponent;
  let fixture: ComponentFixture<CmsprofilepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsprofilepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsprofilepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
