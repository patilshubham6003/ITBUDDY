import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimmasterlistadvanceComponent } from './claimmasterlistadvance.component';

describe('ClaimmasterlistadvanceComponent', () => {
  let component: ClaimmasterlistadvanceComponent;
  let fixture: ComponentFixture<ClaimmasterlistadvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimmasterlistadvanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimmasterlistadvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
