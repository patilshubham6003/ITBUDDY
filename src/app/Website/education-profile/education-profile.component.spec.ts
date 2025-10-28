import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationProfileComponent } from './education-profile.component';

describe('EducationProfileComponent', () => {
  let component: EducationProfileComponent;
  let fixture: ComponentFixture<EducationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
