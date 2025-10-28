import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateexpostfactolistComponent } from './generateexpostfactolist.component';

describe('GenerateexpostfactolistComponent', () => {
  let component: GenerateexpostfactolistComponent;
  let fixture: ComponentFixture<GenerateexpostfactolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateexpostfactolistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateexpostfactolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
