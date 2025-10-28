import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilecompletionlistComponent } from './profilecompletionlist.component';

describe('ProfilecompletionlistComponent', () => {
  let component: ProfilecompletionlistComponent;
  let fixture: ComponentFixture<ProfilecompletionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilecompletionlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilecompletionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
