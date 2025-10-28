import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingdetailsverificationComponent } from './postingdetailsverification.component';

describe('PostingdetailsverificationComponent', () => {
  let component: PostingdetailsverificationComponent;
  let fixture: ComponentFixture<PostingdetailsverificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingdetailsverificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingdetailsverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
