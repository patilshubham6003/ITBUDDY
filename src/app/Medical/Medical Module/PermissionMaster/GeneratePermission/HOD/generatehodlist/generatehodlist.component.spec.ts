import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratehodlistComponent } from './generatehodlist.component';

describe('GeneratehodlistComponent', () => {
  let component: GeneratehodlistComponent;
  let fixture: ComponentFixture<GeneratehodlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratehodlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratehodlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
