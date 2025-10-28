import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficelistComponent } from './officelist.component';

describe('OfficelistComponent', () => {
  let component: OfficelistComponent;
  let fixture: ComponentFixture<OfficelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
