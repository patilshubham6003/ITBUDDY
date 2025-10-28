import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimmasterlistComponent } from './ClaimmasterlistComponent';

describe('ClaimmasterlistComponent', () => {
  let component: ClaimmasterlistComponent;
  let fixture: ComponentFixture<ClaimmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimmasterlistComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
