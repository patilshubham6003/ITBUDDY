import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsjorneyComponent } from './detailsjorney.component';

describe('DetailsjorneyComponent', () => {
  let component: DetailsjorneyComponent;
  let fixture: ComponentFixture<DetailsjorneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsjorneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsjorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
