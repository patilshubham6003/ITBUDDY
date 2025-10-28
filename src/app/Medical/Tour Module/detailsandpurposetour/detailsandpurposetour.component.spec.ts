import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsandpurposetourComponent } from './detailsandpurposetour.component';

describe('DetailsandpurposetourComponent', () => {
  let component: DetailsandpurposetourComponent;
  let fixture: ComponentFixture<DetailsandpurposetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsandpurposetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsandpurposetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
