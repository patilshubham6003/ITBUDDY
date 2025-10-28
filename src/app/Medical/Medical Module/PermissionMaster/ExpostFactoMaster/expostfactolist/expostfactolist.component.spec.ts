import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpostfactolistComponent } from './expostfactolist.component';

describe('ExpostfactolistComponent', () => {
  let component: ExpostfactolistComponent;
  let fixture: ComponentFixture<ExpostfactolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpostfactolistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpostfactolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
